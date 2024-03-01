export interface IProfile {
  name: string;
  dateCreated: number;
  price: number;
  schoolsAdmitted: string[];
  purchaseCount: number;
  essayResponses: IEssayResponse[];
}

export interface IEssayResponse {
  question: string;
  response: string;
}

export interface ITestScore {
  test: string;
  score: string;
}
