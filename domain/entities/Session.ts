export interface SessionNote {
  timestamp: number;  // milliseconds since session start
  text: string;
}

export class Session {
  private id: string;
  private startTime: Date;
  private endTime: Date | null;
  private totalClicks: number;
  private notes: SessionNote[];
  private finalUPM: number;

  constructor(id?: string) {
    this.id = id || new Date().getTime().toString();
    this.startTime = new Date();
    this.endTime = null;
    this.totalClicks = 0;
    this.notes = [];
    this.finalUPM = 0;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getStartTime(): Date {
    return this.startTime;
  }

  getEndTime(): Date | null {
    return this.endTime;
  }

  getTotalClicks(): number {
    return this.totalClicks;
  }

  getNotes(): SessionNote[] {
    return [...this.notes]; // Return copy to prevent direct modification
  }

  getFinalUPM(): number {
    return this.finalUPM;
  }

  getDuration(): number {
    if (!this.endTime) {
      return new Date().getTime() - this.startTime.getTime();
    }
    return this.endTime.getTime() - this.startTime.getTime();
  }

  // Setters and methods
  setEndTime(endTime: Date): void {
    if (endTime < this.startTime) {
      throw new Error('End time cannot be before start time');
    }
    this.endTime = endTime;
  }

  setTotalClicks(clicks: number): void {
    if (clicks < 0) {
      throw new Error('Total clicks cannot be negative');
    }
    this.totalClicks = clicks;
  }

  setFinalUPM(upm: number): void {
    if (upm < 0) {
      throw new Error('UPM cannot be negative');
    }
    this.finalUPM = upm;
  }

  addNote(note: SessionNote): void {
    if (!note.text.trim()) {
      throw new Error('Note text cannot be empty');
    }
    if (note.timestamp < 0) {
      throw new Error('Note timestamp cannot be negative');
    }
    if (this.isComplete()) {
      throw new Error('Cannot add notes to completed session');
    }
    this.notes.push({
      timestamp: note.timestamp,
      text: note.text.trim()
    });
  }

  setProperties(props: {
    id?: string;
    startTime?: Date;
    endTime?: Date | null;
    totalClicks?: number;
    notes?: SessionNote[];
    finalUPM?: number;
  }): void {
    if (props.id) this.id = props.id;
    if (props.startTime) this.startTime = props.startTime;
    if ('endTime' in props) {
      this.endTime = props.endTime ?? null;
    }
    if (typeof props.totalClicks === 'number') this.setTotalClicks(props.totalClicks);
    if (props.notes) this.notes = [...props.notes];
    if (typeof props.finalUPM === 'number') this.setFinalUPM(props.finalUPM);
  }

  toJSON() {
    return {
      id: this.id,
      startTime: this.startTime,
      endTime: this.endTime,
      totalClicks: this.totalClicks,
      notes: this.notes,
      finalUPM: this.finalUPM
    };
  }

  static fromJSON(data: any): Session {
    const session = new Session(data.id);
    session.setProperties({
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : null,
      totalClicks: data.totalClicks,
      notes: data.notes,
      finalUPM: data.finalUPM
    });
    return session;
  }

  isComplete(): boolean {
    return this.endTime !== null;
  }
}