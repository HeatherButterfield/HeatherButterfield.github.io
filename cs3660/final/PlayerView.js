class PlayerView {
    constructor(storageService, localStorageService, formTemplateUrl, listTemplateUrl, listContainerId, formContainerId, playerViewModel)
    {
      this.storageService = storageService;
      this.localStorageService = localStorageService;
      this.formTemplateUrl = formTemplateUrl;
      this.listTemplateUrl = listTemplateUrl;
      this.listContainerId = listContainerId;
      this.formContainerId = formContainerId;
      this.playerViewModel = playerViewModel;
    }
    RenderPlayerList() {
      const head = $("thead");
      head.empty();
      head.append('<tr><th scope="col" style="display: none;">#</th><th scope="col" class="name">Name <span class="icon"><i class="fas fa-caret-down"></i></span></th><th scope="col" class="league">Team <span class="icon"></span></th><th scope="col" class="coach">Phone <span class="icon"></span></th> <th scope="col" class="admin">Age<th scope="col" class="actions">Actions <span class="icon"></span></th></tr>');
      const body = $("tbody");
      body.empty();
        this.storageService.list().done(function( response) {
         for (let i=0; i<response.length; i++) {
          let player = response[i];
          const id = player.id;
          const name = player.name;
          const team = player.team;
          const phone = player.phone;
          const age = player.age;
          const row = '<tr data-toggle="tooltip" data-placement="bottom" title="More information on the ' + name + ' team" id="' + id + '"><th scope="row" style="display: none;">' + id + '</th><td>' + name + '</td><td>' + team + '</td><td>' + phone + '</td><td>' + age + '</td><td style="color: #3b4e94;"><i class="fas fa-edit" data-toggle="modal" data-target="#editForm" onclick="PlayerVw.EditPlayer(' + id + ');"></i><i class="fas fa-trash-alt" data-toggle="modal" data-target="#deleteModal" onclick="localStorage.setItem(\'toDelete\', ' + id + ');"></i><a tabindex="0" role="button" data-toggle="popover" data-trigger="focus" title="' + id + ' Team" data-content="Some basic information about the team" data-html="true"><i class="fas fa-question-circle"></i></a></td></tr>';
          body.append(row);
        }
      });
    }
    EditPlayer(id) {
      localStorage.setItem("toEdit", id);
      let idField = document.getElementById("idField");
      let nameField = document.getElementById("nameField");
      let teamField = document.getElementById("teamField");
      let phoneField = document.getElementById("phoneField");
      let ageField = document.getElementById("ageField");
      if (id) {
        this.storageService.get(id).done(function( response) {
            idField.value = response[0].id;
            nameField.value = response[0].name;
            teamField.value = response[0].team;
            phoneField.value = response[0].phone;
            ageField.value = response[0].age;
        });
      }
      else {
        idField.value = "";
        nameField.value = "";
        teamField.value = "";
        phoneField.value = "";
        ageField.value = "";
        localStorage.setItem("toEdit", "");
      }
      this.RenderPlayerList();
    }
    SubmitEdit(id) {
      let idField = document.getElementById("idField");
      let nameField = document.getElementById("nameField");
      let teamField = document.getElementById("teamField");
      let phoneField = document.getElementById("phoneField");
      let ageField = document.getElementById("ageField");

      const values = {
        "id": idField.value,
        "name": nameField.value,
        "team": teamField.value,
        "phone": phoneField.value,
        "age": ageField.value
      };

      if (id) {
        this.storageService.update(id, JSON.stringify(values));
        this.RenderPlayerList();
      }
      else {
        this.storageService.create(idField.value, JSON.stringify(values));
        this.RenderPlayerList();
      }
    }
    DeletePlayer() {
        this.storageService.delete(localStorage.getItem("toDelete"));
        this.RenderPlayerList();
    }
};
