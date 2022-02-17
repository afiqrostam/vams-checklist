var alert_mod = {
  data() {
    return {
      datas: [],
    };
  },
  methods: {
    add(input) {
      var new_id = alert_id++;
      var prefix;
      var classfix;
      if (input.type == 'error') { prefix = 'E'; classfix = 'bg-danger' }
      if (input.type == 'info') { prefix = 'I'; classfix = 'bg-warning' }
      if (input.type == 'success') { prefix = 'S'; classfix = 'bg-primary' }
      this.datas.unshift({
        id: prefix + (new_id).toString().padStart(3, '0'),
        text: input.text,
        type: input.type,
        classfix: classfix
      });
    },
    remove(info) {
      var data = this.datas;
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
      if (input['ack_completed'] == undefined) { input['ack_completed'] = '' }
      if (input['ack_yes'] == undefined) { input['ack_yes'] = '' }
      if (input['ack_no'] == undefined) { input['ack_no'] = '' }
      if (input['ack_ok'] == undefined) { input['ack_ok'] = '' }
      if (input['ack_adjusted'] == undefined) { input['ack_adjusted'] = '' }
      if (input['ack_not_applicable'] == undefined) { input['ack_not_applicable'] = '' }
      if (input['ack_notes'] == undefined) { input['ack_notes'] = '' }
      if (input['ack_taskchecklistcode_comments'] == undefined) { input['ack_taskchecklistcode_comments'] = '' }
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
                ack_code: input['ack_code'],
                ack_desc: input['ack_desc'],
                ack_taskchecklistcode_comments: input['ack_taskchecklistcode_comments'],
                ack_requiredtoclose: input['ack_requiredtoclose'],
                ack_type: input['ack_type'],
                ack_notes: input['ack_notes'],
                ack_completed: input['ack_completed'],
                ack_ok: input['ack_ok'],
                ack_adjusted: input['ack_adjusted'],
                ack_yes: input['ack_yes'],
                ack_no: input['ack_no'],
                ack_not_applicable: input['ack_not_applicable'],
                ack_sequence: input['ack_sequence'],
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
          ack_code: input['ack_code'],
          ack_desc: input['ack_desc'],
          ack_taskchecklistcode_comments: input['ack_taskchecklistcode_comments'],
          ack_requiredtoclose: input['ack_requiredtoclose'],
          ack_type: input['ack_type'],
          ack_notes: input['ack_notes'],
          ack_completed: input['ack_completed'],
          ack_ok: input['ack_ok'],
          ack_adjusted: input['ack_adjusted'],
          ack_yes: input['ack_yes'],
          ack_no: input['ack_no'],
          ack_not_applicable: input['ack_not_applicable'],
          ack_sequence: input['ack_sequence'],
          parentid: input['wo'] + '-' + input['ack_act'] + '-' + input['ack_group_label'],
        });
      }
    },
    snycItems(item) {
      var id = this.raw.findIndex(function (e) { return e['ack_code'] == item['ack_code'] });
      var raw = this.raw[id];
      raw['ack_notes'] = item['ack_notes'];
      raw['ack_not_applicable'] = item['ack_not_applicable'];
      raw['ack_yes'] = item['ack_yes'];
      if (item['ack_yes'] == '-') { item['ack_no'] = '+' }
      else if (item['ack_yes'] == '+') { item['ack_no'] = '-' }
      raw['ack_no'] = item['ack_no'];
      raw['ack_completed'] = item['ack_completed'];
      raw['ack_ok'] = item['ack_ok'];
      if (item['ack_ok'] == '-') { item['ack_adjusted'] = '+' }
      else if (item['ack_ok'] == '+') { item['ack_adjusted'] = '-' }
      raw['ack_adjusted'] = item['ack_adjusted'];
      console.log(item);
      console.log(this.raw[id]);
    },
    getItemCompleted(item) {
      if ((item.ack_completed == '' || item.ack_completed == '-') && item.ack_ok == '' && item.ack_adjusted == '' && item.ack_yes == '' && item.ack_no == '' && item.ack_not_applicable == '') {
        return false
      }
      else { return true }
    },
    getGroupCompleted(group) {
      return group.items.filter(function (item) {
        return !((item.ack_completed == '' || item.ack_completed == '-') && item.ack_ok == '' && item.ack_adjusted == '' && item.ack_yes == '' && item.ack_no == '' && item.ack_not_applicable == '')
      }).length
    }
  }
}
