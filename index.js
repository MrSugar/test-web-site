const data = [
    {
        companyName: "Аэрофлот",
        tariffs: [
            {
                name: "эконом",
                costByOneKm: 4,
                baggage: {
                    type: 1, // 0 - priceOfOneKm , 1 - fixPrice
                    maxWeight: 20,
                    defaultWeight: 5,
                    costOverDefaultWeight: 4000,
                },
            },
            {
                name: "продвинутый",
                costByOneKm: 8,
                baggage: {
                    type: 1,
                    maxWeight: 50,
                    defaultWeight: 20,
                    costOverDefaultWeight: 5000,
                },
                discount: {
                    untilAge: 7,
                    percent: 30,
                },
            },
            {
                name: "люкс",
                costByOneKm: 15,
                baggage: {
                    type: 0,
                    maxWeight: 50,
                    defaultWeight: 0,
                    costOverDefaultWeight: 0,
                },
                discount: {
                    untilAge: 16,
                    percent: 30,
                },
            },
        ],
    },
    {
        companyName: "РЖД",
        tariffs: [
            {
                name: "эконом",
                costByOneKm: 0.5,
                baggage: {
                    type: 0,
                    maxWeight: 50,
                    defaultWeight: 15,
                    costOverDefaultWeight: 50,
                },
                discount: {
                    untilAge: 5,
                    percent: 50,
                },
            },
            {
                name: "продвинутый",
                costByOneKm: 2,
                baggage: {
                    type: 0,
                    maxWeight: 50,
                    defaultWeight: 15,
                    costOverDefaultWeight: 50,
                },
                discount: {
                    untilAge: 8,
                    percent: 30,
                },
            },
            {
                name: "люкс",
                costByOneKm: 4,
                baggage: {
                    type: 0,
                    maxWeight: 60,
                    defaultWeight: 0,
                    costOverDefaultWeight: 0,
                },
                discount: {
                    untilAge: 16,
                    percent: 20,
                },
            },
        ],
    },
];

function renderResult(result) {
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = "";
    if (result.length === 0) {
        resultContainer.innerHTML = "<h3>на данный момент предложений нету</h3>";
        return;
    }
    for (let companyIndex = 0; companyIndex < result.length; companyIndex++) {
        const companyContainer = document.createElement("div");
        const companyName = document.createElement("h3");
        companyName.textContent = result[companyIndex].companyName;
        companyContainer.appendChild(companyName);
        companyContainer.classList.add("companyContainer");

        for (let tariffIndex = 0; tariffIndex < result[companyIndex].availableTariffs.length; tariffIndex++) {
            const tariff = document.createElement("h4");
            tariff.textContent = `${result[companyIndex].availableTariffs[tariffIndex].name}: ${result[companyIndex].availableTariffs[tariffIndex].totalCost} ₽`;

            companyContainer.appendChild(tariff);
        }

        resultContainer.appendChild(companyContainer);
    }
}
function calculate() {
    const distance = document.getElementById("distance").value;
    const age = document.getElementById("age").value;
    const weight = document.getElementById("weight").value;
    console.log("distance", distance);
    let errorText = "";
    if (distance.length == 0) {
        errorText = "Введите растояние";
    } else if (age.length == 0) {
        errorText = "Введите возраст";
    } else if (weight.length == 0) {
        errorText = "Введите вес багажа";
    }
    document.getElementById("validatorText").textContent = errorText;
    if (errorText.length > 0) {
        return;
    }

    const result = [];

    for (let i = 0; i < data.length; i++) {
        const company = data[i];
        const availableTariffs = [];

        for (let j = 0; j < company.tariffs.length; j++) {
            const tariff = company.tariffs[j];
            let availableTariff = weight < tariff.baggage.maxWeight;

            if (!availableTariff) continue;

            let tariffCost = 0;

            tariffCost += tariff.costByOneKm * distance;
            console.log("🚀 ~ file: index.js ~ line 151 ~ calculate ~ tariffCost", tariffCost);

            if (weight > tariff.baggage.defaultWeight) {
                if (tariff.baggage.type === 0) {
                    const diff = weight - tariff.baggage.defaultWeight;
                    tariffCost += tariff.baggage.costOverDefaultWeight * Math.round(diff);
                } else {
                    tariffCost += tariff.baggage.costOverDefaultWeight;
                }
            }
            console.log("🚀 calculate ~ tariffCost", tariffCost);

            const discount = tariff.discount;
            if (discount && age < discount.untilAge) {
                tariffCost -= Math.round(tariffCost / 100) * tariff.discount.percent;
            }
            console.log("🚀 calculate", tariffCost);

            availableTariffs.push({
                name: tariff.name,
                totalCost: tariffCost,
            });
        }
        if (availableTariffs.length > 0) {
            result.push({
                companyName: company.companyName,
                availableTariffs: availableTariffs,
            });
        }
    }

    renderResult(result);
}

document.getElementById("calculate").onclick = calculate;
