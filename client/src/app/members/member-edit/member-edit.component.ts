import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styles: [
  ]
})
export class MemberEditComponent implements OnInit {
  member: Member;
  user: User;

  //if user is going to different website or url outside of project it will ask them are you sure if they have made changes to the form.
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any){
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }
  @ViewChild('editForm') editForm: NgForm;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toastrService: ToastrService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.loadMember();
  }

  updateMember(){
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastrService.success('Profile updated successfully');
      this.editForm.reset(this.member);
    });
  }

  loadMember(){
    this.memberService.getMember(this.user.username).subscribe(member => {
      this.member = member;
    });
  }

}
