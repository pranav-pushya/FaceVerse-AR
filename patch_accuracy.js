const fs = require('fs');

const files = [
  'analyzer.html', 'detector.html', 'filters.html', 
  'game_chain.html', 'game_dj.html', 'game_flappy.html', 
  'game_lv1.html', 'game_lv2.html', 'game_poker.html', 'game_racer.html'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // Make tracking globally robust and lightning fast by lowering confidence thresholds
    const optionsBlock = 'minFaceDetectionConfidence: 0.25, minFacePresenceConfidence: 0.25, minTrackingConfidence: 0.25, ';
    
    if (!content.includes('minFaceDetectionConfidence')) {
        // Find runningMode: "VIDEO",
        content = content.replace(/runningMode:\s*["']VIDEO["'],/g, 'runningMode: "VIDEO", ' + optionsBlock);
        
        if (content.includes(optionsBlock)) {
            fs.writeFileSync(file, content);
            console.log('Patched tracking accuracy in:', file);
        } else {
            console.log('Failed to match runningMode in:', file);
        }
    }
}
