import { Component } from '@angular/core';
import { SidebarComponent } from "../../components/ui/sidebar/sidebar";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-index',
  imports: [SidebarComponent, RouterModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {

}
