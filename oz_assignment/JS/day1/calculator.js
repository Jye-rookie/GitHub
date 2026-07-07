function calculate () {
    const expression = document.getElementById('expression').value;
    console.log(expression);

    const result = eval(expression);
    document.getElementById("result").innerText = '결과:' + result;
}