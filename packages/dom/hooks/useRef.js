/**
 * @return {(function(Element): void) & ({current?: Element})}
 */
export function useRef() {
    /**
     * @type {(function(Element): void) & ({current?: Element})}
     */
    const f = function(ref) {
        f.current = ref;
    };

    return f;
}