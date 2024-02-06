import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-details',
  standalone: true,
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
  imports: [CommonModule, TabsModule, GalleryModule, TimeagoModule]
})
export class MemberDetailsComponent implements OnInit {

  public member: Member | undefined;
  public images: GalleryItem[] = [];

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMember();
  }

  private loadMember(): void {
    var username = this.route.snapshot.paramMap.get('username');
    if (!username) return;

    this.memberService.getMember(username).subscribe({
      next: (member: Member) => {
        this.member = member;
        this.getImages();
      }
    });
  }

  private getImages(): void {
    if (this.member && Object.keys(this.member).length > 0) {
      for (const photo of this.member?.photos) {
        this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
      }
    }
  }

}
