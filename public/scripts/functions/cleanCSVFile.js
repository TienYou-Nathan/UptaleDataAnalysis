//the scope is /scripts/workers so we need to change directory
self.importScripts("../functions/utilities.js")

function cleanCSVFile(details) {
    //sort data by sessionID and Date to ensure events are in correct order
    details = details.sort(
        fieldSorterOptimized(["SessionId", "EventTime"])
    );

    //suppressing duplicate data due to an Uptale bug
    //duplicate matches EventTime, EventName and SessionID
    details = Object.values(details.reduce(
        (accumulator, current) => {
            accumulator[current.SessionId + "|" + JSON.stringify(current.EventTime) + "|" + current.EventName] = current
            return accumulator
        },
        {}
    ));

    //remove all events in a session that fires after a Session_Close event
    //due to uptale bug when VR helmet is put in rest mode
    let currentId = undefined;
    let sessionClosed = false;
    details = details.filter((e) => {
        if (currentId == e.SessionId) {
            if (sessionClosed) {
                return false;
            } else {
                if (e.EventName == "Launch_CloseSession") {
                    sessionClosed = true;
                }
            }
        } else {
            currentId = e.SessionId;
            sessionClosed = false;
        }
        return true;
    });
    delete currentId;
    delete sessionClosed;

    //sort data by sessionID and Date to ensure events are in correct order
    details.forEach((e) => {
        e.EventTime = new Date(e.EventTime);
    });

    details = details.filter(e =>
        e.EventName != "Launch_HeatMap" && e.EventName != "Launch_TopicClick"
    )

    return details
}