var leadProjectTable;

var selectedData = undefined;
const CLIENT_ID =
  "626814190880-mn7rgj6hc6i8c2p6gmat7ifbhoamgthq.apps.googleusercontent.com";

const API_KEY = "AIzaSyCTuTBqZhTwb6ijh8sCou_cDe--NfrbSeM";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar";

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  // maybeEnableButtons();
}
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").style.visibility = "visible";
  }
}
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    // document.getElementById('content').innerText = '';
    // document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById("signout_button").style.visibility = "hidden";
  }
}
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
  // maybeEnableButtons();
}
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";

    // document.getElementById('signout_button').style.visibility = 'visible';
    // document.getElementById('authorize_button').innerText = 'Refresh';
    // await listUpcomingEvents();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
}
$(document).ready(function () {
  // var link = document.createElement('a');
  //                     // link.href = base64;
  //                     // var fName = json.response.name;
  //                     // link.download = fName ;
  //                     link.dispatchEvent(new MouseEvent('handleAuthClick'));

  /**
   * Callback after api.js is loaded.
   */

  /**
   * Callback after the API client is loaded. Loads the
   * discovery doc to initialize the API.
   */

  // document.getElementById('authorize_button').style.visibility = 'hidden';
  document.getElementById("signout_button").style.visibility = "hidden";

  /**
   * Callback after Google Identity Services are loaded.
   */
  leadProjectTable = $("#lead-project").DataTable({
    destroy: true,
    responsive: true,
    columns: [
      { data: "id" },
      { data: "name" },
      { data: "email" },
      { data: "mobileNumber" },
      { data: "pincode" },
      { data: "address" },
      //  {'data': null, wrap: true, "render": function (data) { return '<button class="btn btn-mini btn-primary pull-right"> Schedule</button>' } },
      {
        data: null,
        wrap: true,
        render: function (list) {
          return '<div class="btn-group"> <button type="button"  class="btn btn-success" data-toggle="modal"  style="background-color:#0aad61" " data-target="#projectModal">Schedule</button></div>';
        },
      },
    ],
  });

  leadProjects();
  leadProjectTable.on("click", "button", function (e) {
    let data = leadProjectTable.row(e.target.closest("tr")).data();
    selectedData = data;
    console.log(data);
    $("#scheduleModal").modal("toggle");
  });
});

setTimeout(function () {
  handleAuthClick();
}, 1000);



$('#appointmentBtn').click(function(){
    $("#slotModal").modal("toggle");
    listUpcomingEvents();
})
$("#scheduleButton").click(function () {
  let fromDate = $("#fromDateTime").val();
  let toDate = $("#toDateTime").val();
  console.log(selectedData);
  console.log(fromDate);
  console.log(toDate);
  let formattedFromDate = new Date(fromDate);
  console.log("UTC string:  " + formattedFromDate.toUTCString());
  console.log(convertUtcToCustomString(formattedFromDate.toUTCString()));

  let toFromattedDate = new Date(toDate);
  console.log("UTC string:  " + toFromattedDate.toUTCString());
  console.log(convertUtcToCustomString(formattedFromDate.toUTCString()));

  // '2024-02-26T20:27'
  const event = {
    summary: "CA AppointMent",
    location: selectedData.address + " " + selectedData.pincode,
    description: "CA appointment with the customer",
    start: {
      dateTime:
        convertUtcToCustomString(formattedFromDate.toUTCString()) + ":00-00:00",
      timeZone: "Asia/Calcutta",
    },
    end: {
      dateTime:
        convertUtcToCustomString(toFromattedDate.toUTCString()) + ":00-00:00",
      timeZone: "Asia/Calcutta",
    },
    attendees: [
    //   { email: "hari.haran.pt@cccomplaints.asianpaints.com" },
    //   { email: "praneeth2806@gmail.com" },
    //   { email: "gnkrpn@gmail.com" },
      { email: selectedData.email },
      { email: selectedData.caEmail },
    ],
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(2, 10),
        conferenceSolution: {
          key: {
            type: "hangoutsMeet",
          },
        },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  const request = gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: event,
    sendUpdates: "all",
    // 'timeZone':'Asia/Calcutta',
    conferenceDataVersion: 1,
  });
  //     let str = fromDate;
  // let date = new Date(str );
  // console.log("UTC string:  " + date.toUTCString());
  // console.log(convertUtcToCustomString(date.toUTCString()))

  // console.log("Local string:  " + date.toString());
  request.execute(function (event) {
    if (event != undefined) {
      if (event.code == 401) handleAuthClick();
      else if (event.status === "confirmed") {
        $("#statusMessage").html("Appointment Schedule " + event.status);
        console.log("Event created: " + event.status);
        $("#statusMessage").css("color", "green");
      } else {
        $("#statusMessage").html("Appointment Schedule Failed");
        $("#statusMessage").css("color", "red");
        console.log("Event created: " + event.status);
      }
    }
  });
});

async function listUpcomingEvents() {
    let response;
    try {
        const request = {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            alwaysIncludeEmail:true,
            'orderBy': 'startTime',
        };
        response = await gapi.client.calendar.events.list(request);
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }

    const events = response.result.items;
    if (!events || events.length == 0) {
        document.getElementById('content').innerText = 'No events found.';
        return;
    }
    console.log(events)
    // Flatten to string to display
    const output = events.reduce(
        (str, event) => `${str}${event.summary} [startdate - ${event.start.dateTime || event.start.date}] [enddate -${event.end.dateTime || event.end.date}]  [attendees - ${event.attendees[0].email }]\n`,
        'Events:\n');
    document.getElementById('content').innerText = output;
}

function convertUtcToCustomString(utcString) {
  const date = new Date(utcString);

  // Extract UTC components
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so add 1
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  // Construct custom datetime string
  const customDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;

  return customDateTimeString;
}

function leadProjects() {
  leadProjectTable.clear().draw();

  $.ajax({
    url: "https://apidev.asianpaints.com/hack/customers",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);

      if (response != undefined && response.customerList.length != 0) {
        var list = response.customerList;
        for (let i = 0; i < list.length; i++) {
          if (list[i].name == undefined) list[i].name = "";
          if (list[i].email == undefined) list[i].email = "";
          if (list[i].mobileNumber == undefined) list[i].mobileNumber = "";
          if (list[i].pincode == undefined) list[i].pincode = "";
          if (list[i].address == undefined) list[i].address = "";
        }

        leadProjectTable.rows.add(list).draw();
      }
    },
    error: function (jqXHR) {
      let response = jqXHR.responseText;
      if (response != undefined) {
        response = JSON.parse(response);
        if (response != undefined && response.message != undefined) {
        }
      }
    },
  });
}
