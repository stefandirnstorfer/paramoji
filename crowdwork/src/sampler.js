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

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

export function randomStates(n=15) {
    const states = [];
    while(states.length<n) states.push([]);
    for (let dim=0; dim<5; ++dim) {
        let plain= []
        for (let i=0; i<n; ++i) plain.push((i + Math.random()) / n);
        shuffleArray(plain)
        for (let i in states) {
            if (dim == 4) plain[i] = plain[i] * 2 - 1;
            states[i].push(plain[i]);
        }
    }
    return states;
}

export function choose(list, n, start=[]) {
    const result = start;
    while(result.length<n) {
        let elt = list[Math.floor(Math.random() * list.length)];
        if (!result.includes(elt)) result.push(elt);
    }
    shuffleArray(result)
    return result
}

export function converge(list, target) {
    const mean=[]
    for (var i=0; i<list[0].length; ++i) {
        mean.push(0)
        for (let j = 0; j < list.length; ++j) {
            mean[i] += list[j][i]
        }
        mean[i] /= list.length
    }
    const newList = []
    for (let j=0; j<list.length; ++j) {
        if (j == target) {
            newList.push(list[j])
        } else {
            const newItem = []
            for (let i=0; i<5; ++i) {
                let d = Math.min(1.0, Math.max(0.0, list[target][i]))
                if (i != 4) d = d - mean[i]
                newItem.push(list[j][i] + d/2)
            }
            newList.push(newItem)
        }
    }
    return newList
}