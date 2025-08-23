export default class Loader {
    static loadAssets(assets, callback) {
        let loaded = 0;
        const total = assets.length;

        assets.forEach(asset => {
            const img = new Image();
            img.src = asset;
            img.onload = () => {
                loaded++;
                if (loaded === total) callback();
            };
        });
    }
}
