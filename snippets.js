const octokit = Octokit();

const until = new Date();
until.setDate(until.getDate() - ((until.getDay() - 1) % 7));
until.setHours(0);
until.setMinutes(0);
until.setSeconds(0);
until.setMilliseconds(0);

const since = new Date(until - 7 * 24 * 60 * 60 * 1000);

const user = 'calbach';

octokit.search.commits({
  q: "author:" + user,
  sort: "committer-date",
  per_page: 64
}).then(result => {
  const contentsEl = document.getElementById("contents");
  const prRe = /^(.*) \(#(\d+)\)$/;
  
  const dateBuckets = new Map([
    [[until, new Date()], {}],
    [[since, until], {}]
  ]);
  result.data.items.forEach(c => {
    if (c.repository.owner.startsWith(user + "/")) return;
    
    let bkt;
    for (let [[from, to], b] of dateBuckets) {
      const d = new Date(c.commit.committer.date);
      if (from <= d && d < to) {
        bkt = b;
        break;
      }
    }
    if (!bkt) return;    
    const repo = c.repository.full_name;
    if (!bkt[repo]) {
      bkt[repo] = [];
    }
    bkt[repo].push(c.commit);
  });
  
  for (let [[from, to], b] of dateBuckets) {
    const h1 = document.createElement('h1');
    h1.textContent = `Week of ${from.toDateString()}`;
    contentsEl.append(h1);
    
    for (let repo of Object.keys(b).sort()) {
      const h2 = document.createElement('h2');
      h2.textContent = repo;
      const p = document.createElement('p');
      contentsEl.append(h2);
      contentsEl.append(p);
      
      b[repo].map(c => {
          const msg = c.message.split('\n')[0];
          const match = msg.match(prRe);
          if (!match) {
            return msg;
          }
          return `[#${match[2]}](https://github.com/${repo}/pull/${match[2]}) ${match[1]}`;
        })
        .forEach(line => {
          contentsEl.append(`- ${line}\n`);
        });
    }
  }
});
