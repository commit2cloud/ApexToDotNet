import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, RouterLink],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: true,
    height: 'auto'
  };

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.sessionService.getSessions().subscribe({
      next: (sessions) => {
        const events = sessions.map(session => ({
          id: session.id.toString(),
          title: session.title,
          start: session.startDate,
          end: session.endDate,
          backgroundColor: this.getColorForType(session.sessionType),
          borderColor: this.getColorForType(session.sessionType),
          extendedProps: {
            speaker: session.speaker,
            status: session.status
          }
        }));
        
        this.calendarOptions = {
          ...this.calendarOptions,
          events: events
        };
      },
      error: (err) => console.error('Error loading calendar events', err)
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const sessionId = clickInfo.event.id;
    this.router.navigate(['/sessions', sessionId]);
  }

  private getColorForType(type: string): string {
    switch (type) {
      case 'Break': return '#adb5bd'; // Gray
      case 'General': return '#0d6efd'; // Blue
      case 'Technical': return '#198754'; // Green
      case 'Hands-On': return '#fd7e14'; // Orange
      case 'Business': return '#6f42c1'; // Purple
      default: return '#3788d8';
    }
  }
}
