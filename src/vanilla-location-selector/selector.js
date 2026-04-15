import { wilayas } from './wilayas.js';

export class LocationSelector {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.selectedData = { wilaya: "", commune: "" };
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="location-selector">
        <div class="selector-group">
          <label>Wilaya</label>
          <input type="text" class="search-input" id="wilaya-search" placeholder="Search Wilaya...">
          <select id="wilaya-select">
            <option value="">Select Wilaya</option>
          </select>
        </div>
        <div class="selector-group">
          <label>Commune</label>
          <input type="text" class="search-input" id="commune-search" placeholder="Search Commune..." disabled>
          <select id="commune-select" disabled>
            <option value="">Select Commune</option>
          </select>
        </div>
      </div>
    `;

    this.wilayaSearch = this.container.querySelector('#wilaya-search');
    this.wilayaSelect = this.container.querySelector('#wilaya-select');
    this.communeSearch = this.container.querySelector('#commune-search');
    this.communeSelect = this.container.querySelector('#commune-select');

    this.populateWilayas(wilayas);

    this.wilayaSearch.addEventListener('input', (e) => this.filterWilayas(e.target.value));
    this.wilayaSelect.addEventListener('change', (e) => this.handleWilayaChange(e.target.value));
    
    this.communeSearch.addEventListener('input', (e) => this.filterCommunes(e.target.value));
    this.communeSelect.addEventListener('change', (e) => this.handleCommuneChange(e.target.value));
  }

  populateWilayas(data) {
    this.wilayaSelect.innerHTML = '<option value="">Select Wilaya</option>';
    data.forEach(w => {
      const option = document.createElement('option');
      option.value = w.id;
      option.textContent = `${w.id} - ${w.nameFr} (${w.nameAr})`;
      this.wilayaSelect.appendChild(option);
    });
  }

  filterWilayas(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = wilayas.filter(w => 
      w.nameFr.toLowerCase().includes(term) || 
      w.nameAr.includes(term) || 
      w.id.includes(term)
    );
    this.populateWilayas(filtered);
    // Keep selected if it's still in the list
    if (filtered.find(w => w.id === this.selectedData.wilaya)) {
      this.wilayaSelect.value = this.selectedData.wilaya;
    }
  }

  handleWilayaChange(wilayaId) {
    this.selectedData.wilaya = wilayaId;
    this.selectedData.commune = "";
    
    if (wilayaId) {
      this.communeSearch.disabled = false;
      this.communeSelect.disabled = false;
      const wilaya = wilayas.find(w => w.id === wilayaId);
      this.populateCommunes(wilaya.communes);
    } else {
      this.communeSearch.disabled = true;
      this.communeSelect.disabled = true;
      this.communeSelect.innerHTML = '<option value="">Select Commune</option>';
      this.communeSearch.value = '';
    }
    this.onChange();
  }

  populateCommunes(communes) {
    this.communeSelect.innerHTML = '<option value="">Select Commune</option>';
    communes.forEach(c => {
      const option = document.createElement('option');
      option.value = c;
      option.textContent = c;
      this.communeSelect.appendChild(option);
    });
  }

  filterCommunes(searchTerm) {
    if (!this.selectedData.wilaya) return;
    const wilaya = wilayas.find(w => w.id === this.selectedData.wilaya);
    const term = searchTerm.toLowerCase();
    const filtered = wilaya.communes.filter(c => c.toLowerCase().includes(term));
    this.populateCommunes(filtered);
    if (filtered.includes(this.selectedData.commune)) {
      this.communeSelect.value = this.selectedData.commune;
    }
  }

  handleCommuneChange(commune) {
    this.selectedData.commune = commune;
    this.onChange();
  }

  onChange() {
    console.log("Selected Location:", this.selectedData);
    // Dispatch custom event if needed
    const event = new CustomEvent('locationChanged', { detail: this.selectedData });
    this.container.dispatchEvent(event);
  }

  getValue() {
    return this.selectedData;
  }
}
