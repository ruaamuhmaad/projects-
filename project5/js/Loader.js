
export class Loader {
    static loadJSON(path) {
        return new Promise((resolve, reject) => {
  
            setTimeout(() => {
                try {
               
                    const levelData = {
                        level1: {
                            enemies: [
                                {x: 100, y: 0, type: 'basic'},
                                {x: 300, y: -150, type: 'basic'},
                                {x: 500, y: -300, type: 'fast'},
                                {x: 200, y: -450, type: 'basic'},
                                {x: 600, y: -600, type: 'strong'}
                            ],
                            powerUps: [
                                {x: 400, y: -200, type: 'health'}
                            ],
                            backgroundMusic: 'level1_theme.mp3',
                            difficulty: 1.0
                        }
                    };
                    
               
                    const level = path.includes('level1') ? levelData.level1 : levelData.level1;
                    
                    if (!level) {
                        throw new Error(`Level not found: ${path}`);
                    }
                    
                    resolve(level);
                } catch (error) {
                    reject(new Error(`Failed to load level data: ${error.message}`));
                }
            }, Math.random() * 1000 + 500); 
        });
    }

    static async loadAssets(assetList) {
        const loadPromises = assetList.map(asset => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.1) {
                        resolve({ name: asset, loaded: true });
                    } else {
                        reject(new Error(`Failed to load asset: ${asset}`));
                    }
                }, Math.random() * 500);
            });
        });

        try {
            const results = await Promise.allSettled(loadPromises);
            const successful = results.filter(r => r.status === 'fulfilled');
            const failed = results.filter(r => r.status === 'rejected');
            
            return {
                successful: successful.map(r => r.value),
                failed: failed.map(r => r.reason.message),
                totalCount: assetList.length
            };
        } catch (error) {
            throw new Error(`Asset loading failed: ${error.message}`);
        }
    }

}
