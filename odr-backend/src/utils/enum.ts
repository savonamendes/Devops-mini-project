// enums/inviteStatus.ts
export enum InviteStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export enum EmailStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum EmailTemplate {
  WELCOME_EMAIL = "welcome_email",
  IDEA_SUBMISSION_CONFIRMATION = "idea_submission_confirmation",
  COLLABORATOR_REQUEST = "idea_request_collaborator",
}

export enum DomainURL {
  //ACCEPTIDEAURL = "http://localhost:3000/discussion/",
  ACCEPTIDEAURL = "https://odrlab.com/discussion/",
}
