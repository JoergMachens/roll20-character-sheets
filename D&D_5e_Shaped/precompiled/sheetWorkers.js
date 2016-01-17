on('change:cp change:sp change:ep change:gp change:pp', function () {
	getAttrs(['cp', 'copper_per_gold', 'sp', 'silver_per_gold', 'ep', 'electrum_per_gold', 'gp', 'pp', 'platinum_per_gold'], function (v) {
		var copperPieces = parseFloat(v.cp) || 0;
		var silverPieces = parseFloat(v.sp) || 0;
		var electrumPieces = parseFloat(v.ep) || 0;
		var goldPieces = parseFloat(v.gp) || 0;
		var platinumPieces = parseFloat(v.pp) || 0;
		var copperPerGold = parseFloat(v.copper_per_gold) || 100;
		var silverPerGold = parseFloat(v.silver_per_gold) || 10;
		var electrumPerGold = parseFloat(v.electrum_per_gold) || 2;
		var platinumPerGold = parseFloat(v.platinum_per_gold) || 10;
		var totalGold = (copperPieces / copperPerGold) + (silverPieces / silverPerGold) + (electrumPieces / electrumPerGold) + goldPieces + (platinumPieces * platinumPerGold);
		var coinWeight = (copperPieces + silverPieces + electrumPieces + goldPieces + platinumPieces) / 50;
		setAttrs({
			total_gp: totalGold.toFixed(2),
			weight_coinage: coinWeight
		});
	});
});

var sumRepeating = function (options) {
	var repeatingItem = 'repeating_' + options.collection;

	getSectionIDs(repeatingItem, function (ids) {
		var collectionArray = [];
		var finalSetAttrs = {};
		finalSetAttrs[options.totalField] = 0;

		for (var i = 0; i < ids.length; i++) {
			collectionArray.push(repeatingItem+'_' + ids[i] + '_' + options.toggle);
			if(options.qty) {
				collectionArray.push(repeatingItem + '_' + ids[i] + '_' + options.qty);
			}
			collectionArray.push(repeatingItem+'_' + ids[i] + '_' + options.fieldToAdd);
			if(options.bonus) {
				collectionArray.push(repeatingItem + '_' + ids[i] + '_' + options.bonus);
			}
		}

		getAttrs(collectionArray, function (v) {
			for (var j = 0; j < ids.length; j++) {
				var toggle = v[repeatingItem+'_' + ids[j] + '_' + options.toggle];
				if(toggle === 'undefined' || toggle === 'on') {
					var qty = 1;
					if(options.qty) {
						qty = parseInt(v[repeatingItem+'_' + ids[j] + '_' + options.qty], 10) || 1;
					}
					var fieldToAdd = parseFloat(v[repeatingItem+'_' + ids[j] + '_' + options.fieldToAdd]) || 0;
					if(options.bonus) {
						fieldToAdd += parseFloat(v[repeatingItem+'_' + ids[j] + '_' + options.bonus]) || 0;
					}
					var itemTotal = qty * fieldToAdd;

					if(options.itemTotal) {
						finalSetAttrs[repeatingItem+'_' + ids[j] + '_' + options.itemTotal] = itemTotal;
					}

					finalSetAttrs[options.totalField] += itemTotal;
				}
			}
			setAttrs(finalSetAttrs);
		});
	});
};

on('change:repeating_inventory', function () {
	sumRepeating({
		collection: 'inventory',
		toggle: 'carried',
		qty: 'qty',
		fieldToAdd: 'weight',
		itemTotal: 'weight_total',
		totalField: 'weight_inventory'
	});
});

on('change:repeating_armor', function () {
	sumRepeating({
		collection: 'armor',
		toggle: 'worn',
		fieldToAdd: 'weight',
		totalField: 'weight_armor'
	});
	sumRepeating({
		collection: 'armor',
		toggle: 'worn',
		fieldToAdd: 'ac_base',
		bonus: 'ac_bonus',
		itemTotal: 'ac_total',
		totalField: 'ac_armor_calc'
	});
});