const departInfo = ["title", "Email", "sortOfProduction", "numberOfProduction"];

var db = openDatabase(
  "factory1_db",
  "1.0" /*версия */,
  "Factory Departments" /*отображ имя */,
  1 * 1024 * 1024 /*приь=близ размер */
);
if (!db) {
  alert("Failed to connect Web SQL !");
} else {
  console.log("Done!");
}

// создаем таблицу с цехами
db.transaction(
  function (t) {
    t.executeSql(
      "CREATE TABLE IF NOT EXISTS depart (id integer primary key autoincrement, title TEXT, Email TEXT, sortOfProduction TEXT, numberOfProduction TEXT);"
    );
  },
  (t) => {
    console.log("Table was created");
  }
);

// обновляем список ID
getFactoryIds();

function showAll() {
  console.log("showAll");

  db.transaction(function (tx) {
    tx.executeSql("SELECT * FROM depart", [], function (tx, results) {
      var rows = results?.rows;
      console.log(rows);

      document.getElementById("factoryList").style.display = "block";
      document.getElementById("emailList").style.display = "none";

      var resultsContainer = document.getElementById("factoryData");

      resultsContainer.innerHTML = "";

      for (let item of rows) {
        resHtml = document.createElement("tr");
        resHtml.classList.add("result-item");
        resHtml.innerHTML = `<td>${item.id}</td>`;
        departInfo.forEach((field) => {
          resHtml.innerHTML += `<td>${item[field]}</td>`;
        });
        resultsContainer.append(resHtml);
      }
    });
  });
}

function addNew() {
  console.log("addNew");

  form = new FormData(document.getElementById("form"));

  var factoryData = [];
  form.forEach((item) => {
    factoryData.push(item);
  });

  var numFlds = departInfo.length;
  var fldNames = departInfo.join(",");
  var fldValues = "?,".repeat(numFlds).slice(0, -1);
  console.log(fldValues);

  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO depart (" + fldNames + ") VALUES (" + fldValues + ")",
      factoryData
    );
  }, null);

  showAll();
  getFactoryIds();
}

function clearData() {
  console.log("clearData");

  document.getElementById("form").reset();
}

function getFactoryIds() {
  console.log("getFactoryIds");
  db.transaction(function (tx) {
    tx.executeSql("SELECT id FROM depart", [], function (tx, results) {
      var factoryIds = document.getElementById("factoryIds");

      factoryIds.innerHTML =
        '<option value="" selected>Выберите id цеха</option>';
      for (let row of results.rows) {
        const option = document.createElement("option");
        option.value = row.id;
        option.text = row.id;
        factoryIds.append(option);
      }
    });
  });
}

function deleteId() {
  console.log("deleteId");

  var factoryId = document.getElementById("factoryIds").value;
  db.transaction(function (tx) {
    tx.executeSql("DELETE FROM depart WHERE id=" + factoryId, []);
  });

  showAll();
  getFactoryIds();
}

function addNewColumn() {
  console.log("addNewColumn");

  var newColumnName = document.getElementById("newColumnName").value;

  db.transaction(function (tx) {
    tx.executeSql("ALTER TABLE depart ADD " + newColumnName + " text");
  }, null);

  departInfo.push(newColumnName);

  var newColumnHeader = document.createElement("th");
  newColumnHeader.innerText = newColumnName;
  document.getElementById("tableHeader").append(newColumnHeader);

  var factoryForm = document.getElementById("form");
  factoryForm.innerHTML += `<label for="${newColumnName}">${newColumnName}<input type="text" id="${newColumnName}" name="${newColumnName}"></label>`;
}

function showEmails() {
  console.log("showEmails");

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT bossEmail, production FROM depart where production='Еда'",
      [],
      function (tx, results) {
        var rows = results?.rows;
        console.log(rows);

        document.getElementById("factoryList").style.display = "none";
        document.getElementById("emailList").style.display = "block";

        var resultsContainer = document.getElementById("emailData");
        resultsContainer.innerHTML = "";

        for (let item of rows) {
          resHtml = document.createElement("tr");
          resHtml.classList.add("result-item");
          resHtml.innerHTML = `<td>${item["bossEmail"]}</td><td>${item["production"]}</td>`;
          resultsContainer.append(resHtml);
        }
      }
    );
  });
}

function deleteTable() {
  console.log("deleteTable");

  db.transaction(function (tx) {
    tx.executeSql("DROP TABLE depart");
  }, null);
}
