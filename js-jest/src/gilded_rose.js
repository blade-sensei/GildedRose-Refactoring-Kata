const Inventory = {
  backstagePass: "Backstage passes to a TAFKAL80ETC concert",
  agedBrie: "Aged Brie",
  sulfuras: "Sulfuras, Hand of Ragnaros",
};

class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class ConjuredItem extends Item {
  constructor(name, sellIn, quality) {
    super(name, sellIn, quality);
  }

  decrementQuality() {
    if (this.quality > 1) {
      this.quality = this.quality - 2;
    }
  }

  decreaseExpirationSellIn() {
    this.sellIn = this.sellIn - 1;
  }

  update() {
    this.decrementQuality();
    this.decreaseExpirationSellIn();
  }
}

class ClassicItem extends Item {
  constructor(name, sellIn, quality) {
    super(name, sellIn, quality);
  }

  decrementQuality() {
    if (this.quality > 0) {
      this.quality = this.quality - 1;
    }
  }

  decreaseExpirationSellIn() {
    this.sellIn = this.sellIn - 1;
  }

  isItemExpired() {
    return this.sellIn < 0;
  }

  update() {
    this.decrementQuality();
    this.decreaseExpirationSellIn();
    if (this.isItemExpired()) {
      this.decrementQuality();
    }
  }
}

class AgedBrie extends Item {
  //ça va être partagé dans une classe de base et donc il faut la faire sortir
  maxQuality = 50;
  constructor(name, sellIn, quality) {
    super(name, sellIn, quality);
  }

  increaseQuality() {
    if (this.quality < this.maxQuality) {
      this.quality = this.quality + 1;
    }
  }

  decreaseExpirationSellIn() {
    this.sellIn = this.sellIn - 1;
  }

  update() {
    this.increaseQuality();
    this.decreaseExpirationSellIn();
  }
}

class BackStageItem extends Item {
  lastMinutePass = 6;
  almostLastMinutePass = 11;
  maxQuality = 50;

  incrementQuality() {
    if (this.canIncrementQuality()) {
      this.quality = this.quality + 1;
    }
  }

  canIncrementQuality() {
    return this.quality < this.maxQuality;
  }

  decreaseExpirationSellIn() {
    this.sellIn = this.sellIn - 1;
  }

  getQualityForBackstagePass() {
    let quality = this.quality;

    if (this.sellIn < this.lastMinutePass) {
      if (quality < this.maxQuality) {
        return quality + 2;
      }
    } else if (this.sellIn < this.almostLastMinutePass) {
      if (quality < this.maxQuality) {
        return quality + 1;
      }
    }
    return quality;
  }

  isItemExpired() {
    return this.sellIn < 0;
  }

  makeBackstagePassUnusable() {
    this.quality = 0;
  }

  update() {
      this.incrementQuality();
      this.decreaseExpirationSellIn();
      this.quality = this.getQualityForBackstagePass();
      if (this.isItemExpired()) {
        this.makeBackstagePassUnusable();
      }
  }
}

class Shop {
  constructor(items = []) {
    this.items = items;
  }

  backstagePass = Inventory.backstagePass;
  agedBrie = Inventory.agedBrie;
  sulfuras = Inventory.sulfuras;


  isClassicItem(item) {
    return (
      item.name !== this.agedBrie &&
      item.name !== this.backstagePass &&
      item.name !== this.sulfuras &&
      !item.name.includes("conjured")
    );
  }

  isConjuredItem(item) {
    return item.name.includes("conjured");
  }


  updateQuality() {
    for (const item of this.items) {
      //inverse le if et le else pour avoir if (this.isItemThatIncreaseValueWhenIsOld) ?
      //peut être plus lisible

      if (this.isClassicItem(item) || this.isConjuredItem(item) ||  this.isAgeBrieItem(item) || this.isBackStagePassItem(item)) {
        item.update();
      }

    }

    return this.items;
  }

  isBackStagePassItem(item) {
    return item.name === this.backstagePass;
  }

  isAgeBrieItem(item) {
    return item.name === this.agedBrie;
  }

  //peut etre faire une class BackStagePass qui prend un iteam et qui calcul le quality
}

module.exports = {
  Item,
  Shop,
  Inventory,
  ClassicItem,
  ConjuredItem,
  AgedBrie,
  BackStageItem,
};
