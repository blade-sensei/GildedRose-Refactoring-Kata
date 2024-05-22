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
    super(`${name} conjured`, sellIn, quality);
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
  constructor(sellIn, quality) {
    super("Aged Brie", sellIn, quality);
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

  constructor(sellIn, quality) {
    super("Backstage passes to a TAFKAL80ETC concert", sellIn, quality);
  }

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

class Sulfuras extends Item {
  constructor(sellIn) {
    const legendaryQuality = 80
    super("Sulfuras", sellIn, legendaryQuality)
  }

  update() {}
}

class Shop {
  constructor(items = []) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      //inverse le if et le else pour avoir if (this.isItemThatIncreaseValueWhenIsOld) ?
      //peut être plus lisible
        item.update();
    }

    return this.items;
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
  Sulfuras,
};