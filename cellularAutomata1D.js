'use strict';

const cellularAutomata1D = ((document) => {
    'use strict';

    const root = document.querySelector('.root');

    let cellCount = 201;
    let rowCount = 95;

    const ruleStates = [
        [1, 1, 1],
        [1, 1, 0],
        [1, 0, 1],
        [1, 0, 0],
        [0, 1, 1],
        [0, 1, 0],
        [0, 0, 1],
        [0, 0, 0]
    ];

    // http://atlas.wolfram.com/01/01/105/
    const rules = {
        rule22: [
            'inactive',
            'inactive',
            'inactive',
            'active',
            'inactive',
            'active',
            'active',
            'inactive'
        ],
        rule57: [
            'inactive',
            'inactive',
            'active',
            'active',
            'active',
            'inactive',
            'inactive',
            'active'
        ],
        rule105: [
            'inactive',
            'active',
            'active',
            'inactive',
            'active',
            'inactive',
            'inactive',
            'active'
        ]
    };

    const randomBinary = () => {
        const max = 1;
        const min = 0;
        return Math.floor(
            Math.random() * (max - min + 1)
        );
    };

    const createRowOfCells = () => {
        let row = document.createElement('div');
        row.classList.add('row');
        for (let i = 0; i < cellCount; i++) {
            let cell = document.createElement('div');
            row.appendChild(cell);
        }
        root.appendChild(row);
        return row;
    };

    const startWithSingleBlackCell = (row) => {
        row.childNodes[Math.floor(row.childNodes.length / 2)].classList.add('active');
    };

    const randomizeRow = (row) => {
        for (let i = 0; i < row.childNodes.length; i++) {
            row.childNodes[i].classList.add(randomBinary() ? 'active' : 'inactive');
        }
    };

    const duplicateRow = (rule) => {
        const allRows = document.querySelectorAll('.row');
        const lastRow = allRows[allRows.length - 1];
        let clone = lastRow.cloneNode(true);
        applyRule(clone, lastRow, rule);
        root.appendChild(clone);
    };

    const applyRule = (row, parentRow, rule) => {
        for (let i = 0; i < row.childNodes.length; i++) {
            let target = row.childNodes[i];
            let prevSelf = parentRow.childNodes[i];
            let leftSibling = prevSelf.previousElementSibling || parentRow.childNodes[parentRow.childNodes.length - 1];
            let rightSibling = prevSelf.nextElementSibling || parentRow.childNodes[0];

            removeAnyState(row.childNodes[i]);

            for (let r = 0; r < ruleStates.length; r++) {
                if (
                    isActive(leftSibling) === ruleStates[r][0] &&
                    isActive(prevSelf) === ruleStates[r][1] &&
                    isActive(rightSibling) === ruleStates[r][2]
                ) {
                    target.classList.add(rule[r]);
                }
            }
        }
    };

    const removeAnyState = (cell) => {
        cell.classList.remove('active');
        cell.classList.remove('inactive');
    };

    const isActive = (cell) => {
        return cell.classList.contains('active') ? 1 : 0;
    };

    const start = (rule, random) => {

        if (!verifyRule(rule)) throw Error(`rule has wrong format`);

        random = !!random;

        let row = createRowOfCells();

        random ? randomizeRow(row) : startWithSingleBlackCell(row);

        for (let i = 0; i < rowCount; i++) {
            duplicateRow(rule);
        }
    };

    const verifyRule = (rule) => {
        if (!Array.isArray(rule)) return false;
        if (rule.length != 8) return false;
        for (let i = 0; i < rule.length; i++) {
            if (rule[i] !== 'active' && rule[i] !== 'inactive')  return false;
        }
        return true;
    };

    return {
        rules: rules,
        run: start,
        setRowCount: function (count) {
            rowCount = count;
            return this;
        },
        setCellCount: function (count) {
            cellCount = count;
            return this;
        }
    }

})(document);