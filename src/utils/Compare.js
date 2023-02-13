const COMPARE_RESULT = {
    LESS_THAN: "LESS_THAN",
    EQUAL: "EQUAL",
    GREATER_THAN: "GREATER_THAN",
    LESS_THAN_OR_EQUAL: "LESS_THAN_OR_EQUAL",
    GREATER_THAN_OR_EQUAL: "GREATER_THAN_OR_EQUAL",
    NOT_EQUAL: "NOT_EQUAL",
}

const standardKey = (x) => x;

const compare = (a, b, key=standardKey) => {
    let aKey = key(a);
    let bKey = key(b);
    if (aKey < bKey) return COMPARE_RESULT.LESS_THAN;
    if (aKey > bKey) return COMPARE_RESULT.GREATER_THAN;
    if (aKey == bKey) return COMPARE_RESULT.EQUAL;
}

const compareCondition = (a, b, condition, key=standardKey) => {
    let compareResult = compare(a, b, key);
    return conditionHelper(compareResult, condition);
}

const conditionHelper = (compareResult, condition) => {
    const fn = conditionFunctions[condition];
    if (!fn) {
      throw new Error("Invalid condition");
    }
    return fn(compareResult);
}

const conditionFunctions = {
    [COMPARE_RESULT.LESS_THAN]:     
    (compareResult) => compareResult == COMPARE_RESULT.LESS_THAN,

    [COMPARE_RESULT.EQUAL]:         
    (compareResult) => compareResult == COMPARE_RESULT.EQUAL,

    [COMPARE_RESULT.GREATER_THAN]: 
    (compareResult) => compareResult == COMPARE_RESULT.GREATER_THAN,

    [COMPARE_RESULT.LESS_THAN_OR_EQUAL]: 
    (compareResult) => compareResult == COMPARE_RESULT.LESS_THAN || compareResult == COMPARE_RESULT.EQUAL,

    [COMPARE_RESULT.GREATER_THAN_OR_EQUAL]: 
    (compareResult) => compareResult == COMPARE_RESULT.GREATER_THAN || compareResult == COMPARE_RESULT.EQUAL,

    [COMPARE_RESULT.NOT_EQUAL]: 
    (compareResult) => compareResult != COMPARE_RESULT.EQUAL
};

export { 
    COMPARE_RESULT, 
    compare, 
    compareCondition,
};
