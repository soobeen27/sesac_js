function f(x) {
    let trigger = 10;
    while (x) {
        if (x % 10 > trigger) {
            return 0;
        }
        trigger = x % 10;
        x = parseInt(x / 10);
    }
    return 1;
}

console.log(f(654321) + f(12345) + f(442211) + f(202104));
