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

class Shop {
  constructor(items = []) {
    this.items = items;
  }

  maxQuality = 50;
  lastMinutePass = 6;
  almostLastMinutePass = 11;

  backstagePass = Inventory.backstagePass;
  agedBrie = Inventory.agedBrie;
  sulfuras = Inventory.sulfuras;

  defaultDecrementQuality(item) {
    if (item.quality > 0) {
      //cette condition risque de poser probleme. peut être il faut l extraire ailleurs
      if (item.name != this.sulfuras) {
        item.quality = item.quality - 1;
      }
    }
  }

  isVintageItem(item) {
    return item.name == this.agedBrie || item.name == this.backstagePass;
  }

  isClassicItem(item) {
    return item.name !== this.agedBrie && item.name !== this.backstagePass && item.name !== this.sulfuras && !item.name.includes('conjured');
  }

  isConjuredItem(item) {
    return item.name.includes("conjured") 
  }

  incrementQuality(item) {
    if (this.canIncrementQuality(item)) {
      item.quality = item.quality + 1;
    }
  }

  isItemExpired(item) {
    return item.sellIn < 0;
  }

  canIncrementQuality(item) {
    return item.quality < this.maxQuality;
  }

  isInExpirableItem(item) {
    return item.name == this.sulfuras;
  }

  updateQuality() {
    for (const item of this.items) {
      //inverse le if et le else pour avoir if (this.isItemThatIncreaseValueWhenIsOld) ?
      //peut être plus lisible

      //item classique
      if (this.isClassicItem(item)) {
        this.defaultDecrementQuality(item);
        this.decreaseExpirationSellIn(item);
        if (this.isItemExpired(item)) {
          this.defaultDecrementQuality(item);
        }
      }

      if (this.isConjuredItem(item)) {
        this.defaultDecrementQuality(item);
        this.defaultDecrementQuality(item);
        this.decreaseExpirationSellIn(item);
      }

      //item ageBrie
      if (this.isAgeBrieItem(item)) {
        this.incrementQuality(item);
        this.decreaseExpirationSellIn(item);
      }

      if (this.isBackStagePassItem(item)) {
        this.incrementQuality(item);
        this.decreaseExpirationSellIn(item);
        item.quality = this.getQualityForBackstagePass(item);

        if (this.isItemExpired(item)) {
          this.makeBackstagePassUnusable(item);
        }

      }
    }

    return this.items;
  }

  decreaseExpirationSellIn(item) {
    if (!this.isInExpirableItem(item)) {
      item.sellIn = item.sellIn - 1;
    }
  }

  isBackStagePassItem(item) {
    return item.name === this.backstagePass;
  }

  isAgeBrieItem(item) {
    return item.name === this.agedBrie;
  }

  makeBackstagePassUnusable(item) {
    item.quality = 0;
  }

  //peut etre faire une class BackStagePass qui prend un iteam et qui calcul le quality
  getQualityForBackstagePass(item) {
    let quality = item.quality;

    if (item.sellIn < this.lastMinutePass) {
      if (quality < this.maxQuality) {
        return quality + 2;
      }
    } else if (item.sellIn < this.almostLastMinutePass) {
      if (quality < this.maxQuality) {
        return quality + 1;
      }
    }
    return quality;
  }
}

module.exports = {
  Item,
  Shop,
  Inventory,
};

