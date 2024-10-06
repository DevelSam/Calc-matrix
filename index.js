document.getElementById('createMatrix').addEventListener('click', createMatrix);
document.getElementById('solve').addEventListener('click', solveSystem);

function createMatrix() {
    const size = parseInt(document.getElementById('size').value);
    const matrixContainer = document.getElementById('matrixContainer');
    matrixContainer.innerHTML = ''; // Очищаем предыдущие поля

    // Создаем поля для коэффициентов матрицы
    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        row.className = 'matrix-row';
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.required = true
            input.className = 'a-type vvod'
            input.placeholder = `a[${i}][${j}]`;
            row.appendChild(input);
        }
        // Дополнительное поле для свободного члена
        const inputB = document.createElement('input');
        inputB.type = 'number';
        inputB.placeholder = `b[${i}]`;
        inputB.required = true
        inputB.className = 'a-type vvod';
        row.appendChild(inputB);
        
        matrixContainer.appendChild(row);
    }
}

function solveSystem() {
    const size = parseInt(document.getElementById('size').value);
    const method = document.getElementById('method').value;
    const matrixContainer = document.getElementById('matrixContainer');
    
    let A = [];
    let B = [];

    // Извлекаем данные из полей ввода
    const rows = matrixContainer.querySelectorAll('.matrix-row');
    for (let i = 0; i < rows.length; i++) {
        const coefficients = rows[i].querySelectorAll('input[type="number"]');
        let row = [];
        for (let j = 0; j < coefficients.length - 1; j++) {
            row.push(parseFloat(coefficients[j].value));
        }
        A.push(row);
        B.push(parseFloat(coefficients[coefficients.length - 1].value));
    }
    let allFieldsFilled = true;
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A[i].length; j++) {
            if (isNaN(A[i][j])) {
                allFieldsFilled = false;
                break;
            }
        }
        if (isNaN(B[i])) {
            allFieldsFilled = false;
            break;
        }
    }
    if (!allFieldsFilled) {
        alert('Заполните все поля перед выполнением метода');
    } else {
        let methoduse = '';
        let result;
        if (method === 'gauss') {
            result = gauss(A, B);
            methoduse = ' методом Гаусса';
        } else {
            result = kramer(A, B);
            methoduse = ' методом Крамера';
        }
    
    try {
        document.getElementById('result').innerHTML = result.map((element, index) =>  ' x' + '<sub>' + (index + 1)+ '</sub> = ' + element ).join(', ') + '  -----> Решенно '+ methoduse;
        
    } catch (err) {
        document.getElementById('result').innerText = 'Нет решения';
    }
    
}
}


function gauss(A, B) {
    const n = A.length;
    
    for (let i = 0; i < n; i++) {
        // Позиционируем максимальный элемент в голову строки
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                maxRow = k;
            }
        }
        
        // Меняем местами строки
        [A[i], A[maxRow]] = [A[maxRow], A[i]];
        [B[i], B[maxRow]] = [B[maxRow], B[i]];

        // Приводим к ступенчатому виду
        for (let k = i + 1; k < n; k++) {
            const factor = A[k][i] / A[i][i];
            A[k][i] = 0; // Зануляем нижний элемент
            for (let j = i + 1; j < n; j++) {
                A[k][j] -= factor * A[i][j];
            }
            B[k] -= factor * B[i];
        }
    }

    // Обратный ход метода Гаусса
    const X = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        X[i] = (B[i] / A[i][i]).toFixed(3);
        if (isNaN(X[i])) {
            return "нет решения";
        }
        for (let k = i - 1; k >= 0; k--) {
            B[k] -= A[k][i] * X[i];
        }
    }
    if (X.includes(Infinity)) {
        return "нет решения";
    }
    return X;
}
function kramer(A, B) {
    const detA = math.det(A); // Определитель основной матрицы
    if (detA === 0) {
        return 'Система не имеет уникального решения.';
    }
    
    let solutions = [];

    for (let i = 0; i < B.length; i++) { 
        const Ai = A.map((row, j) => {
            return row.map((val, k) => (k === i ? B[j] : val));
        });
        const detAi = math.det(Ai); // Определитель матрицы с замененным столбцом
        const solution = (detAi / detA).toFixed(3);
        if (isNaN(solution)) {
            return "нет решения";
        }
        solutions.push(solution);
    }
    
    if (solutions.includes(Infinity)) {
        return "нет решения";
    }
    return solutions;
}



