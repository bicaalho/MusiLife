class CarrosselSlider extends HTMLElement {
  constructor() {
    super();
    this._gap = 16;
    this._visible = Number(this.getAttribute('visible')) || 4;

    this._shadow = this.attachShadow({ mode: 'open' });

    this._shadow.innerHTML = `
      <style>
        :host { display:block; box-sizing:border-box; }
        .wrap {
          width: ${this.getAttribute('width') || '500px'};
          height: ${this.getAttribute('height') || ''};
          position: relative;
        }
        .track {
          height: 100%;
          display:flex;
          gap: ${this._gap}px;
          padding: 12px;
          overflow-x: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          box-sizing: border-box;
        }
        .item {
          flex: 0 0 auto;
          scroll-snap-align: center;
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
          box-sizing: border-box;
          min-height: calc(100% - 24px);
        }

        .item img{
                  box-shadow: 0 3px 13.2px 0 rgba(0, 0, 0, 0.25);
}

        .btn {
          background: transparent;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width:40px; height:40px;
          display:flex; align-items:center; justify-content:center;
          border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          z-index: 10;
        }
        .prev { left: -30px; }
        .next { right: -40px; }
      </style>

      <div class="wrap" part="container">
        <button class="btn prev" part="prev" aria-label="Anterior">&#10094;</button>
        <div class="track" part="track"></div>
        <button class="btn next" part="next" aria-label="Próximo">&#10095;</button>
      </div>
    `;

    this._track = this._shadow.querySelector('.track');
    this._btnPrev = this._shadow.querySelector('.prev');
    this._btnNext = this._shadow.querySelector('.next');
    this._wrap = this._shadow.querySelector('.wrap');

    // handlers
    this._onNext = () => this.next();
    this._onPrev = () => this.prev();
    this._onResize = this._onResize.bind(this);
  }

  connectedCallback() {
    this._btnNext.addEventListener('click', this._onNext);
    this._btnPrev.addEventListener('click', this._onPrev);
    window.addEventListener('resize', this._onResize);
  }

  disconnectedCallback() {
    this._btnNext.removeEventListener('click', this._onNext);
    this._btnPrev.removeEventListener('click', this._onPrev);
    window.removeEventListener('resize', this._onResize);
  }
  draw(items = [], renderer = null) {
    this._track.innerHTML = '';

    items.forEach((item, idx) => {
      let content;

      if (typeof renderer === "function") {
        content = renderer(item, idx);

      } else if (typeof item === "string") {
        const img = document.createElement("img");
        img.src = item;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        content = img;

      } else if (item instanceof HTMLElement) {
        content = item;

      } else {
        const w = document.createElement("div");
        w.textContent = JSON.stringify(item);
        content = w;
      }

      // wrapper do card
      const itemEl = document.createElement("div");
      itemEl.className = 'item';

      itemEl.appendChild(content);

      this._track.appendChild(itemEl);
    });
    this._applyItemWidths();

    this._track.scrollLeft = 0;
  }

  _applyItemWidths() {
    const items = Array.from(this._track.querySelectorAll('.item'));
    if (!items.length) return;
    const visible = Math.max(1, Math.floor(this._visible) || 1);

    const containerWidth = this._wrap.clientWidth || this._wrap.getBoundingClientRect().width;
    if (!containerWidth) {
      requestAnimationFrame(() => this._applyItemWidths());
      return;
    }

    const totalGap = this._gap * (visible - 1);
    const itemWidth = Math.max(40, Math.floor((containerWidth - totalGap) / visible));

    items.forEach(it => {
      it.style.width = itemWidth + 'px';
    });
  }

  _getStep() {
    const first = this._track.querySelector('.item');
    if (!first) return 0;
    const rect = first.getBoundingClientRect();
    return Math.round(rect.width + this._gap);
  }

  next() {
    const step = this._getStep();
    if (!step) return;
    this._track.scrollBy({ left: step, behavior: 'smooth' });
  }

  prev() {
    const step = this._getStep();
    if (!step) return;
    this._track.scrollBy({ left: -step, behavior: 'smooth' });
  }

  setOptions(opts = {}) {
    if (opts.width) this._wrap.style.width = opts.width;
    if (opts.height) this._wrap.style.height = opts.height;
    if (opts.gap !== undefined) {
      this._gap = Number(opts.gap);
      this._shadow.querySelector('.track').style.gap = this._gap + 'px';
    }
    if (opts.visible !== undefined) {
      this._visible = Number(opts.visible) || 1;
      this._applyItemWidths();
    }
  }

  _onResize() {
    this._applyItemWidths();
  }
}

if (!customElements.get('carrossel-slider')) {
  customElements.define('carrossel-slider', CarrosselSlider);
}
