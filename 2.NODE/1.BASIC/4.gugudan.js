function gugudan(dan) {
    for (i = 1; i <= 9; i++) {
        console.log(`${dan}x${i}=${dan * i}`);
    }
}

gugudan(3);

for (let dan = 5; dan <= 7; dan++) {
    gugudan(dan);
}
