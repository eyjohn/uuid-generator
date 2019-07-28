const { events, Job } = require("brigadier");

all_events = [
  { name: "check_run", description: "A check run event with any action. A second event qualified by action will also be emitted." },
  { name: "check_run:completed", description: "The status of a check run was updated to completed." },
  { name: "check_run:created", description: "A new check run was created." },
  { name: "check_run:requested_action", description: "Someone requested that an action be taken." },
  { name: "check_run:rerequested", description: "Someone requested to re-run your check run." },
  { name: "check_suite:completed", description: "The status of a check suite was updated to completed." },
  { name: "check_suite:requested", description: "A new check suite was created." },
  { name: "check_suite:rerequested", description: "Someone requested to re-run your check suite." },
  { name: "commit_comment", description: "A commit comment event with any action. A second event qualified by action will also be emitted." },
  { name: "commit_comment:created", description: "A commit comment was created." },
  { name: "create", description: "A branch or tag was created." },
  { name: "deployment", description: "A deployment was created." },
  { name: "deployment_status", description: "A deployment's sdtatus has changed." },
  { name: "issue_comment", description: "An issue comment event with any action. A second event qualified by action will also be emitted." },
  { name: "issue_comment:created", description: "An issue comment was created." },
  { name: "issue_comment:edited", description: "An issue comment was edited." },
  { name: "issue_comment:deleted", description: "An issue comment was deleted." },
  { name: "pull_request", description: "A pull request event with any action. A second event qualified by action will also be emitted." },
  { name: "pull_request:assigned", description: "A pull request was assigned." },
  { name: "pull_request:closed", description: "A pull request was closed." },
  { name: "pull_request:edited", description: "A pull request was edited (e.g. title or body is edited)." },
  { name: "pull_request:labeled", description: "A new label was assigned to a pull request." },
  { name: "pull_request:locked", description: "A pull request was locked." },
  { name: "pull_request:opened", description: "A new pull request was opened." },
  { name: "pull_request:ready_for_review", description: "A pull request is ready for review." },
  { name: "pull_request:reopened", description: "A closed pulled request was re-opened." },
  { name: "pull_request:review_request_removed", description: "An existing request for pull request review was removed." },
  { name: "pull_request:review_requested", description: "A pull request review was re-requested." },
  { name: "pull_request:unassigned", description: "A pull request was unassigned." },
  { name: "pull_request:unlabeled", description: "A label was removed from a pull request." },
  { name: "pull_request:unlocked", description: "A pull request was unlocked." },
  { name: "pull_request_review", description: "A pull request review with any action. A second event qualified by action will also be emitted." },
  { name: "pull_request_review:submitted", description: "A pull request review was submitted." },
  { name: "pull_request_review:edited", description: "A pull request review was edited." },
  { name: "pull_request_review:dismissed", description: "A pull request review was dismissed." },
  { name: "pull_request_review_comment", description: "A pull request review comment with any action. A second event qualified by action will also be emitted." },
  { name: "pull_request_review_comment:created", description: "A new pull request review comment was created." },
  { name: "pull_request_review_comment:deleted", description: "An existing pull request review comment was deleted." },
  { name: "pull_request_review_comment:edited", description: "An existing pull request review comment was edited." },
  { name: "push", description: "A commit was pushed to a branch or a new tag was applied." },
  { name: "release", description: "A release event with any action. A second event qualified by action will also be emitted." },
  { name: "release:created", description: "A new release was created." },
  { name: "release:deleted", description: "An existing release was deleted." },
  { name: "release:edited", description: "An existing release was edited." },
  { name: "release:prereleased", description: "A release is pre-released." },
  { name: "release:published", description: "A release is published." },
  { name: "release:unpublished", description: "A release is unpublished." },
  { name: "status", description: "The status of a git commit was changed." },
];

all_events.forEach(event => {
  events.on(event.name, function(e, project) {
    console.log(event, e, project);
  })
});

// // GitHub Check events to watch for
// //
// // Note that a GitHub App will automatically generate these events
// // from a `push` event, so we don't need an explicit push event handler any longer
// events.on("check_suite:requested", checkRequested);
// events.on("check_suite:rerequested", checkRequested);
// events.on("check_run:rerequested", checkRequested);

// // Our main test logic, refactored into a function that returns the job
// function runTests(e, project) {
//   // Create a new job
//   var testRunner = new Job("test-runner");

//   // We want our job to run the stock Docker Python 3 image
//   testRunner.image = "python:3";

//   // Now we want it to run these commands in order:
//   testRunner.tasks = [
//     "cd /src",
//     "pip install -r requirements.txt",
//     "python setup.py test"
//   ];

//   // Display logs from the job Pod
//   testRunner.streamLogs = true;

//   return testRunner;
// }

// // This runs our main test job, updating GitHub along the way
// function checkRequested(e, p) {
//   console.log("check requested");

//   // This Check Run image handles updating GitHub
//   const checkRunImage = "brigadecore/brigade-github-check-run:latest";

//   // Common configuration
//   const env = {
//     CHECK_PAYLOAD: e.payload,
//     CHECK_NAME: "Brigade",
//     CHECK_TITLE: "Run Tests",
//   };

//   // For convenience, we'll create three jobs: one for each GitHub Check
//   // stage.
//   const start = new Job("start-run", checkRunImage);
//   start.imageForcePull = true;
//   start.env = env;
//   start.env.CHECK_SUMMARY = "Beginning test run";

//   const end = new Job("end-run", checkRunImage);
//   end.imageForcePull = true;
//   end.env = env;

//   // Now we run the jobs in order:
//   // - Notify GitHub of start
//   // - Run the tests
//   // - Notify GitHub of completion
//   //
//   // On error, we catch the error and notify GitHub of a failure.
//   start.run().then(() => {
//     return runTests(e, p).run()
//   }).then( (result) => {
//     end.env.CHECK_CONCLUSION = "success"
//     end.env.CHECK_SUMMARY = "Build completed"
//     end.env.CHECK_TEXT = result.toString()
//     return end.run()
//   }).catch( (err) => {
//     // In this case, we mark the ending failed.
//     end.env.CHECK_CONCLUSION = "failure"
//     end.env.CHECK_SUMMARY = "Build failed"
//     end.env.CHECK_TEXT = `Error: ${ err }`
//     return end.run()
//   });
// }
