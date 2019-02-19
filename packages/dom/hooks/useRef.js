export function useRef() {
    let f = (ref) => {
        f.current = ref;
    };
    return f;
}