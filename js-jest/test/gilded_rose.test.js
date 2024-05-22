const {Shop, Item, Inventory, ClassicItem, ConjuredItem, AgedBrie, BackStageItem, Sulfuras, GodItem } = require("../src/gilded_rose");

describe("Gilded Rose", function() {
  it("should foo", function() {
    const gildedRose = new Shop([new ClassicItem("foo", 0, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].name).toBe("foo");
  });

  it("should decrease sellIn at the end of the day", function() {
    const gildedRose = new Shop([new ClassicItem("foo", 1, 10), new ClassicItem("test", 3, 2)]);
    const items = gildedRose.updateQuality();

    expect(items[0].sellIn).toBe(0);
    expect(items[0].quality).toBe(9);
    expect(items[1].sellIn).toBe(2);
    expect(items[1].quality).toBe(1);
  })

  it("should quality degrade 2 times faster if sellIn is greater than today", function() {
    const gildedRose = new Shop([new ClassicItem("foo", -2, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(8);
  });

  it("should quality never be negative", function() {
    const gildedRose = new Shop([new ClassicItem("foo", 2, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });

  it("Aged Brie increases quality", function() {
    const gildedRose = new Shop([new AgedBrie(2, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(1);
    expect(items[0].sellIn).toBe(1);
  });

  it("quality is never >= 50", function() {
    const gildedRose = new Shop([new AgedBrie(2, 50)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });

  it("should not decrease sellIn for the Sulfuras item", function() {
    const gildedRose = new Shop([new Sulfuras(10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(10);
  });

  it("should  Sulfuras item quality equals 80", function() {
    const gildedRose = new Shop([new Sulfuras(10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(80);
  });

  it(`should increase quality if item is ${Inventory.backstagePass}`, function() {
    const gildedRose = new Shop([new BackStageItem(12, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(21);
    expect(items[0].sellIn).toBe(11);
  });

  it("should increase quality by 2 if item is Backstage passes to a TAFKAL80ETC concert and sellIn is <= 10", function() {
    const gildedRose = new Shop([new BackStageItem(10, 20), new BackStageItem(9, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(22);
    expect(items[1].quality).toBe(12);
  });

  it("should increase quality by 3 if item is Backstage passes to a TAFKAL80ETC concert  and sellIn is <= 5", function() {
    const gildedRose = new Shop([new BackStageItem(5, 20), new BackStageItem(3, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(23);
    expect(items[1].quality).toBe(13);
  });
  
  it("should quality == 0 if Backstage passes to a TAFKAL80ETC concert", function() {
    const gildedRose = new Shop([new BackStageItem(0, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });


  it("should decreased quality 2 times faster if element is conjured", function() {
    const gildedRose = new Shop([new ConjuredItem("foo", 10, 50)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(48);
  });

  it("should decrease sellIn by one each day for a conjured item", function() {
    // Instanciate with only name and add conjured in the constructor
    const gildedRose = new Shop([new ConjuredItem("foo", 10, 50)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(9);
  });

  it("should update ClassicItem", function() {
    const gildedRose = new Shop([new ClassicItem("foo", 10, 50)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(49);
    expect(items[0].sellIn).toBe(9);
  });

  it("should update ClassicItem", function() {
    const gildedRose = new Shop([new ClassicItem("foo", 10, 50)])
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(49);
    expect(items[0].sellIn).toBe(9);
  });
});


/**
 * Une fois que la date de péremption est passée, la qualité se dégrade deux fois plus rapidement. 🟢
 * La qualité (quality) d'un produit ne peut jamais être négative. 🟢
 * "Aged Brie" augmente sa qualité (quality) plus le temps passe.  🟢
 *  La qualité d'un produit n'est jamais de plus de 50. 🟢
 * "Sulfuras", étant un objet légendaire, n'a pas de date de péremption et ne perd jamais en qualité (quality) 🟢
 *  Test si sulfuras a un controle pour ne pas avoir de date de péremption 🟢
 * "Backstage passes", comme le "Aged Brie", augmente sa qualité (quality) plus le temps passe (sellIn) ; La qualité augmente de 2 quand il reste 10 jours ou moins et de 3 quand il reste 5 jours ou moins, mais la qualité tombe à 0 après le concert. 🟢
 * Aged Brie ? augmente avec les mêmes régles que le backstage ? 🟢
 * "Backstage passes", mais la qualité tombe à 0 après le concert.
 **/
