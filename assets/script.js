var config = {
    apiKey: "AIzaSyD256tv0rjX0zGLrV5wzOL8uQYJqxFTauU",
    authDomain: "train-scheduler-eda2c.firebaseapp.com",
    databaseURL: "https://train-scheduler-eda2c.firebaseio.com",
    projectId: "train-scheduler-eda2c",
    storageBucket: "",
    messagingSenderId: "772350527690"
  };
  firebase.initializeApp(config);

  var name = "";
  var destination = "";
  var firstTrain = 0;
  var frequency = 0;
  var firstTimeConverted = 0;
  var currentTime = moment();
  var diffTime = 0;
  var tRemaninder = 0;
  var tMinutesTillTrain = 0;
  var nextTrain = 0;

  $("#addTrain").on("click", function(){
      event.preventDefault();

      name = $("#trainName").val().trim()
      destination = $("#destinationName").val().trim()
      firstTrain = $("#firstTime").val().trim()
      frequency = $("#trainFrequency").val().trim()

      firebase.database().ref().push({
          name: name,
          destination: destination,
          firstTrain : firstTrain,
          frequency: frequency
      })
      
   $("form").trigger("reset");

  })

  firebase.database().ref().on("child_added", function(snapshot){
    firstTrain = snapshot.val().firstTrain;
    firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");

      diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      
      tRemainder = diffTime % snapshot.val().frequency;
      
      tMinutesTillTrain = snapshot.val().frequency - tRemainder;
      
      nextTrain = moment().add(tMinutesTillTrain, "minutes");
      nextTrainTime = moment(nextTrain).format("HH:mm");

    var newTr = $("<tr>").addClass("newTableRow");
    var newName = $("<td>").text(snapshot.val().name);
    var newDestination = $("<td>").text(snapshot.val().destination);
    var newFrequency = $("<td>").text(snapshot.val().frequency);    
    var nextArrival = $("<td>").text(moment(nextTrain).format("HH:mm"));
    var minutesAway = $("<td>").text(tMinutesTillTrain);
    newTr.append(newName)
        .append(newDestination)
        .append(newFrequency)
        .append(nextArrival)
        .append(minutesAway)

        $(".table").append(newTr);
  })