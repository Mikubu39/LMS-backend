export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  GUEST = 'guest',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', // Trắc nghiệm 1 hoặc nhiều đáp án
  FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK', // Điền từ
}

export enum UserGender {
  MALE,
  FEMALE,
  OTHER,
}

// rating.enum.ts
export enum Rating {
  ONE_STAR = 1,
  TWO_STARS = 2,
  THREE_STARS = 3,
  FOUR_STARS = 4,
  FIVE_STARS = 5,
}
