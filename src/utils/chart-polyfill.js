/**
 * Minimal Chart.js polyfill for client-side rendering
 * This file provides a simplified implementation of Chart.js for when the real library isn't available
 */

class Chart {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.id = Math.random().toString(36).substring(2, 15);
    this.data = config.data;
    this.options = config.options || {};
    
    // Store reference to this chart
    if (!window.charts) {
      window.charts = {};
    }
    window.charts[this.id] = this;
    
    // Render placeholder
    this.renderPlaceholder();
  }
  
  renderPlaceholder() {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const parent = ctx.parentNode;
    
    // Create placeholder div
    const placeholder = document.createElement('div');
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    placeholder.style.backgroundColor = '#f9fafb';
    placeholder.style.border = '1px dashed #cbd5e1';
    placeholder.style.borderRadius = '0.5rem';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.padding = '1rem';
    placeholder.style.boxSizing = 'border-box';
    placeholder.style.color = '#64748b';
    placeholder.style.fontFamily = 'system-ui, sans-serif';
    
    // Create message
    const message = document.createElement('div');
    message.textContent = 'Chart visualization will appear here with actual data';
    message.style.textAlign = 'center';
    
    placeholder.appendChild(message);
    
    // Replace canvas with placeholder
    parent.replaceChild(placeholder, ctx);
    this.placeholder = placeholder;
  }
  
  destroy() {
    if (this.placeholder && this.placeholder.parentNode) {
      this.placeholder.parentNode.removeChild(this.placeholder);
    }
    if (window.charts && window.charts[this.id]) {
      delete window.charts[this.id];
    }
  }
  
  update() {
    // No-op
  }
}

// Expose Chart to global scope
if (typeof window !== 'undefined') {
  window.Chart = Chart;
}

export default Chart;
