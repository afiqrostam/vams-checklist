var alert_mod = {
  data() {
    return {
      alerts: [],
      infos: [],
    };
  },
  methods: {
    addAlert(alert) {
      var new_id = alert_id++;
      this.alerts.unshift({ id: 'A' + (new_id).toString().padStart(3, '0'), text: alert });
    },
    addInfo(info) {
      var new_id = info_id++;
      this.infos.unshift({ id: 'I' + (new_id).toString().padStart(3, '0'), text: info });
    },
    removeAlert(alert) {
      var data = this.alerts;
      setTimeout(function (data, alert) {
        data = data.filter((t) => t !== alert);
      }, 200, data, alert);
    },
    removeInfo(info) {
      var data = this.infos;
      setTimeout(function (data, info) {
        data = data.filter((t) => t !== info);
      }, 200, data, info);
    }
  },
};

var checklist_mod = {
  data() {
    return {
      data: {},
      raw: [],
    }
  },
  methods: {
    addItems(input) {
      input['wo'] = 'WO' + input['ack_event'];
      if (input['ack_completed'] == undefined) { input['completed'] = false }
      else {
        if (input['ack_completed'] == '-') { input['completed'] = false }
        else { input['completed'] = true }
      }
      if (input['ack_yes'] == undefined) { input['yes'] = false }
      else {
        if (input['ack_yes'] == '-') { input['yes'] = false }
        else { input['yes'] = true }
      }
      if (input['ack_no'] == undefined) { input['no'] = false }
      else {
        if (input['ack_no'] == '-') { input['no'] = false }
        else { input['no'] = true }
      }
      if (input['ack_ok'] == undefined) { input['ok'] = false }
      else {
        if (input['ack_ok'] == '-') { input['ok'] = false }
        else { input['ok'] = true }
      }
      if (input['ack_adjusted'] == undefined) { input['adjusted'] = false }
      else {
        if (input['ack_adjusted'] == '-') { input['adjusted'] = false }
        else { input['adjusted'] = true }
      }
      if (input['ack_not_applicable'] == undefined) { input['not_applicable'] = false }
      else {
        if (input['ack_not_applicable'] == '') { input['not_applicable'] = false }
        else { input['not_applicable'] = true }
      }
      if (input['ack_taskchecklistcode_comments'] == undefined) { input['message'] = input['ack_desc'] }
      else { input['message'] = input['ack_desc'] + ' ' + input['ack_taskchecklistcode_comments'] }
      this.raw.push(input)
      if (Object.keys(this.data).length == 0) {
        var header = {
          id: input['wo'],
          org: input['evt_org'],
          url: dux + input['ack_event'],
          wo: input['ack_event'],
          desc: input['evt_desc'],
          status: input['evt_status_desc'],
          activities: [{
            id: input['wo'] + '-' + input['ack_act'],
            act: input['ack_act'],
            act_note: input['act_note'],
            parentid: input['wo'],
            groups: [{
              id: input['wo'] + '-' + input['ack_act'] + '-' + input['ack_group_label'],
              group_code: input['ack_group_label'],
              group_label: input['ack_group_label_desc'],
              parentid: input['wo'] + '-' + input['ack_act'],
              items: [{
                id: input['ack_code'],
                message: input['message'],
                entry: input['ack_desc'],
                comments: input['ack_taskchecklistcode_comments'],
                required: input['ack_requiredtoclose'],
                type: input['ack_type'],
                note: input['ack_note'],
                completed: input['completed'],
                ok: input['ok'],
                adjusted: input['adjusted'],
                yes: input['yes'],
                no: input['no'],
                not_applicable: input['not_applicable'],
                seq: input['ack_sequence'],
                parentid: input['wo'] + '-' + input['ack_act'] + '-' + input['ack_group_label'],
              }],
            }],
          }],
        };
        this.data = header;
      }
      else {
        if (this.data.activities.filter(function (e) {
          return e.id == input['wo'] + '-' + input['ack_act']
        }).length == 0) {
          this.data.activities.push({
            id: input['wo'] + '-' + input['ack_act'],
            act: input['ack_act'],
            act_note: input['act_note'],
            parentid: input['wo'],
            groups: []
          });
        }
        var activity = this.data.activities.findIndex(function (e) {
          return e.id == input['wo'] + '-' + input['ack_act']
        });
        if (this.data.activities[activity].groups.filter(function (e) {
          return e.id == input['wo'] + '-' + input['ack_act'] + '-' + input['ack_group_label']
        }).length == 0) {
          this.data.activities[activity].groups.push({
            id: input['wo'] + '-' + input['ack_act'] + '-' + input['ack_group_label'],
            group_code: input['ack_group_label'],
            group_label: input['ack_group_label_desc'],
            parentid: input['wo'] + '-' + input['ack_act'],
            items: []
          });
        }
        var group = this.data.activities[activity].groups.findIndex(function (e) {
          return e.id == input['wo'] + '-' + input['ack_act'] + '-' + input['ack_group_label']
        });
        this.data.activities[activity].groups[group].items.push({
          id: input['ack_code'],
          entry: input['ack_desc'],
          message: input['message'],
          comments: input['ack_taskchecklistcode_comments'],
          required: input['ack_requiredtoclose'],
          type: input['ack_type'],
          note: input['ack_notes'],
          completed: input['completed'],
          ok: input['ok'],
          adjusted: input['adjusted'],
          yes: input['yes'],
          no: input['no'],
          not_applicable: input['not_applicable'],
          seq: input['ack_sequence'],
          parentid: input['wo'] + '-' + input['ack_act'] + '-' + input['ack_group_label'],
        });
      }
    },
    snycItems(item) {
      var id = this.raw.findIndex(function (e) { return e.ack_code == item.id });
      this.raw[id].ack_notes = item.note;
    }
  }
}
