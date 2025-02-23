/**
 * Domain Layer - Entities
 * 
 * Session entity should be independent of infrastructure concerns
 */

export interface SessionNote {
  timestamp: number;  // milliseconds since session start
  text: string;
}

export interface SessionProperties {
  id?: string;
  startTime?: number;
  endTime?: number | null;
  totalClicks?: number;
  notes?: SessionNote[];
  finalUPM?: number;
}

export class Session {
  private id: string;
  private startTime: number;
  private endTime: number | null;
  private totalClicks: number;
  private notes: SessionNote[];
  private finalUPM: number;
  private smoothnessMetrics: {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  };

  constructor(id: string, startTime: number) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = null;
    this.totalClicks = 0;
    this.notes = [];
    this.finalUPM = 0;
    this.smoothnessMetrics = {
      consistency: 0,
      rhythm: 0,
      flowState: 0,
      criticalSuccess: 0,
      criticalFailure: 0
    };
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getStartTime(): number {
    return this.startTime;
  }

  getEndTime(): number | null {
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

  getDuration(currentTime?: number): number {
    const end = this.endTime ?? currentTime;
    if (!end) {
      throw new Error('Cannot calculate duration without end time or current time');
    }
    return end - this.startTime;
  }

  getSmoothnessMetrics(): {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  } {
    return { ...this.smoothnessMetrics };
  }

  // Setters and methods
  setEndTime(endTime: number): void {
    this.endTime = endTime;
    // Recalculate final metrics immediately
    if (this.totalClicks > 0) {
      const duration = this.getDuration();
      const minutes = duration / (1000 * 60);
      this.finalUPM = minutes > 0 ? Math.round((this.totalClicks / minutes) * 10) / 10 : 0;
    }
  }

  setTotalClicks(clicks: number): void {
    this.totalClicks = clicks;
    // Update UPM immediately when clicks change
    if (this.endTime) {
      const duration = this.getDuration();
      const minutes = duration / (1000 * 60);
      this.finalUPM = minutes > 0 ? Math.round((clicks / minutes) * 10) / 10 : 0;
    }
  }

  addNote(note: SessionNote): void {
    this.notes.push(note);
  }

  setProperties(props: SessionProperties): void {
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
      finalUPM: this.finalUPM,
      smoothnessMetrics: this.smoothnessMetrics
    };
  }

  static fromJSON(data: any): Session {
    const session = new Session(data.id, data.startTime);
    session.setProperties({
      endTime: data.endTime,
      totalClicks: data.totalClicks,
      notes: data.notes,
      finalUPM: data.finalUPM
    });
    session.updateSmoothnessMetrics(data.smoothnessMetrics);
    return session;
  }

  isComplete(): boolean {
    return this.endTime !== null;
  }

  updateSmoothnessMetrics(metrics: {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  }): void {
    this.smoothnessMetrics = { ...metrics };
  }
}