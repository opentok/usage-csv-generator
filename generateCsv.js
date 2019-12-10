const moment = require('moment');
const uniq = require('lodash.uniq');
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');

const rawdata = fs.readFileSync('input.json');
const items = JSON.parse(rawdata).items;

// UOMs included in total usage
const totalUoms = [
  'Individual Archive Minutes',
  'SD Composed Archive Minutes',
  'HD Composed Archive Minutes',
  'SD Broadcast Content Created Minutes',
  'HD Broadcast Content Created Minutes',
  'Content Viewed - HLS Minutes',
  'SIP User Minutes',
  'Streamed Subscribed Minutes'
];

const formate = (aUsages, projectId) => {
  let usages = aUsages || [];
  let time = [];
  const archived = {};
  const subscribed = {};
  const csvExport = [];
  let individualTotal = 0;
  let sdArchivedTotal = 0;
  let hdArchivedTotal = 0;
  let archivedTotal = 0;
  let subscribedTotal = 0;
  let sdBroadcastCreatedTotal = 0;
  let hdBroadcastCreatedTotal = 0;
  let hlsViewedTotal = 0;
  let sipTotal = 0;
  let audioOnlyTotal = 0;
  let audioAndVideoTotal = 0;
  let subscribedRelayedTotal = 0;
  let subscribedRoutedTotal = 0;
  const projects = {};
  let data;
  let total = 0;

  usages.forEach(usage => {
    const date = moment.unix(usage.startDate / 1000);
    const dateStr = date.format('YYYY-MM-DD');

    const aggregateProjects = key => {
      if (!projects[usage.projectId]) {
        projects[usage.projectId] = {
          archived: 0, subscribed: 0, hls: 0, sip: 0
        };
      }
      projects[usage.projectId][key] += usage.quantity;
    };

    const aggregate = () => {
      if (['Individual Archive Minutes',
        'SD Composed Archive Minutes',
        'HD Composed Archive Minutes'].includes(usage.uom)) {
        archived[dateStr] = (archived[dateStr] ? archived[dateStr] : 0) + usage.quantity;
        archivedTotal += usage.quantity;

        time.push(dateStr);

        // NOTE: archive overage minutes are at account level
        // it will not be displayed in project graphs

        aggregateProjects('archived');
      }

      switch (usage.uom) {
        case 'Individual Archive Minutes' :
          individualTotal += usage.quantity;
          break;
        case 'SD Composed Archive Minutes' :
          sdArchivedTotal += usage.quantity;
          break;
        case 'HD Composed Archive Minutes' :
          hdArchivedTotal += usage.quantity;
          break;
        case 'SD Broadcast Content Created Minutes' :
          sdBroadcastCreatedTotal += usage.quantity;
          aggregateProjects('hls');
          break;
        case 'HD Broadcast Content Created Minutes' :
          hdBroadcastCreatedTotal += usage.quantity;
          aggregateProjects('hls');
          break;
        case 'Content Viewed - HLS Minutes' :
          hlsViewedTotal += usage.quantity;
          aggregateProjects('hls');
          break;
        case 'SIP User Minutes' :
          sipTotal += usage.quantity;
          aggregateProjects('sip');
          break;
        case 'Streamed Subscribed Minutes' :
          subscribed[dateStr] = (subscribed[dateStr] ? subscribed[dateStr] : 0) + usage.quantity;
          subscribedTotal += usage.quantity;
          time.push(dateStr);
          aggregateProjects('subscribed');
          break;
        case 'Audio Only Streamed Subscribed Minutes' :
          audioOnlyTotal += usage.quantity;
          break;
        case 'Audio and Video Streamed Subscribed' :
          audioAndVideoTotal += usage.quantity;
          break;
        case 'Streamed Subscribed Relayed Minutes' :
          subscribedRelayedTotal += usage.quantity;
          break;
        case 'Streamed Subscribed Routed Minutes' :
          subscribedRoutedTotal += usage.quantity;
          break;
        default:
          break;
      }

      if (totalUoms.includes(usage.uom)) {
        total += usage.quantity;
      }

      csvExport.push({
        DATE: dateStr,
        'ACCOUNT ID': usage.accountId,
        'PROJECT ID': usage.projectId,
        TYPE: usage.uom,
        'USAGE(MINS)': usage.quantity
      });
    };

    if (!projectId || projectId === usage.projectId) {
      aggregate();
    }
  });

  time = uniq(time);
  time.sort((a, b) => {
    return moment(b).unix() - moment(a).unix();
  });

  data = {
    archived: ['archived'],
    subscribed: ['subscribed']
  };
  time.forEach(date => {
    data.archived.push((archived[date] ? archived[date] : 0));
    data.subscribed.push((subscribed[date] ? subscribed[date] : 0));
  });
  time.unshift('x');
  data.time = time;

  data.total = {
    archived: archivedTotal,
    sdArchived: sdArchivedTotal,
    hdArchived: hdArchivedTotal,
    individual: individualTotal,
    subscribed: subscribedTotal,
    projects,
    sdBroadcastCreated: sdBroadcastCreatedTotal,
    hdBroadcastCreated: hdBroadcastCreatedTotal,
    hlsViewed: hlsViewedTotal,
    sip: sipTotal,
    subscribedRelayed: subscribedRelayedTotal,
    subscribedRouted: subscribedRoutedTotal,
    audioOnly: audioOnlyTotal,
    audioAndVideo: audioAndVideoTotal,
    total
  };
  data.csv = csvExport;
  return data;
};

const data = formate(items, process.argv[2]);
const csv = new ObjectsToCsv(data.csv);
csv.toDisk('./output.csv');
