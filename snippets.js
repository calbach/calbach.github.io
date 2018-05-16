const octokit = Octokit();

const until = new Date();
until.setDate(until.getDate() - ((until.getDay() - 1) % 7));
until.setHours(0);
until.setMinutes(0);
until.setSeconds(0);
until.setMilliseconds(0);

const since = new Date(until - 7 * 24 * 60 * 60 * 1000);

const contentsEl = document.getElementById("contents");

// TODO: Grab from all recent repos.
octokit.repos.getCommits({
  owner: "all-of-us",
  repo: "workbench",
  author: "calbach",
  per_page: 128,
  since: since,
  until: until
}).then(result => {
  const prRe = /^(.*) \(#(\d+)\)$/;
  result.data
    .map(r => {
      const msg = r.commit.message.split('\n')[0];
      const match = msg.match(prRe);
      if (!match) {
        return msg;
      }
      return `[#${match[2]}](https://github.com/all-of-us/workbench/pull/${match[2]}) ${match[1]}`;
    })
    .forEach(line => {
      contentsEl.textContent += `- ${line}\n`;
    });
})
