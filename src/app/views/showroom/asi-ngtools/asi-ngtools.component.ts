import { Component } from '@angular/core';

@Component({
  selector: 'asi-ngtools',
  templateUrl: './asi-ngtools.component.html',
  host: {'class': 'page'}
})
export class AsiNgToolsPage {

  version = '5.0.0';

  constructor(){
  }

}
