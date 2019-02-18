/**
 * @param {Array.<*>} a1
 * @param {Array.<*>} a2
 */
export function diffArray(a1, a2) {
    if (!a1 && !!a2) {
        return true;
    } else if (a1 && a2 && a1.length === a2.length) {
        for (let i = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) {
                return true;
            }
        }
    } else {
        return true;
    }
}