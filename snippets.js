const until = new Date();
until.setDate(until.getDate() - ((until.getDay() - 1) % 7));
until.setHours(0);
until.setMinutes(0);
until.setSeconds(0);
until.setMilliseconds(0);

const since = new Date(until - 7 * 24 * 60 * 60 * 1000);

octokit.repos.getCommits({
  owner: "all-of-us",
  repo: "workbench",
  author: "calbach",
  per_page: 128,
  since: since,
  until: until
}).then(result => {
  console.log(JSON.stringify(result["data"].map(r => r.commit.message.split('\n')[0])));
})
