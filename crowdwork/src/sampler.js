const EMOJI=[0x1F600, 0x1F601, 0x1F602, 0x1F923, 0x1F603,
    0x1F604, 0x1F605, 0x1F606, 0x1F609, 0x1F60A,
    0x1F60B, 0x1F60E, 0x1F60D, 0x1F618, 0x1F617,
    0x1F619, 0x1F61A, 0x263A,  0x1F642,
    0x1F929, 0x1F914, 0x1F928, 0x1F610, 0x1F611,
    0x1F644, 0x1F60F, 0x1F623, 0x1F625,
    0x1F62E, 0x1F910, 0x1F62F, 0x1F62A, 0x1F62B,
    0x1F634, 0x1F60C, 0x1F61B, 0x1F61C, 0x1F61D,
    0x1F924, 0x1F612, 0x1F613, 0x1F614, 0x1F615,
    0x1F911, 0x1F632, 0x2639,  0x1F641,
    0x1F616, 0x1F61E, 0x1F61F, 0x1F624, 0x1F622,
    0x1F62D, 0x1F626, 0x1F627, 0x1F628, 0x1F629,
    0x1F92F, 0x1F62C, 0x1F630, 0x1F631, 0x1F633,
    0x1F92A, 0x1F635, 0x1F621, 0x1F620,
    0x1F922, 0x1F92E];

const dimensions = ['valence', 'arousal', 'potency', 'contempt', 'expression'];

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export function randomStates(ab, n=15) {
    const states = [];
    if (ab=="B") {
        while(states.length<n) {
            var code = EMOJI[Math.floor(Math.random() * EMOJI.length)];
            if (!states.find(x => x.code == code)) states.push({code});
        }
    } else {
        while(states.length<n) states.push({});
        for (let dim of dimensions) {
            let plain= []
            for (let i=0; i<n; ++i) plain.push(i);
            shuffleArray(plain)
            for (var i in states) {
                if (dim == 'contempt') plain[i] = Math.max(0, plain[i]*2 - (n-1));
                states[i][dim] = Math.round(plain[i] * 100.0 / (n-1));
            }
        }
    }
    return states;
}
