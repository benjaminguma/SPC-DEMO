import { Request } from 'express';
import { AppAbility } from 'src/ability/services/ability.factory.service';
import { User } from 'src/auth/model/user.entity';
import { ManagedWallet } from 'src/managed-wallet/models/managed-wallet.entity';
import { SchoolOrgMember } from 'src/schol-organization/models/school-org-member.entity';
import { School } from 'src/school/model/school.entity';

declare global {
  interface RequestWithUserPayload extends Request {
    user: User;
  }
  // ppp
  interface RequestWithUserAndSchool extends Request {
    school: School;
    user: User;
  }
  interface RequestWithUserAndOrg extends Request {
    selectedOrganization: SchoolOrgMember;
    user: User;
  }
  interface RequestWithUserAndOrgAndAbility extends Request {
    selectedOrganization: SchoolOrgMember;
    user: User;
    ability?: AppAbility;
  }
  interface ModifiedRequest extends Request {
    user: User;
    ability?: AppAbility;
    wallet: ManagedWallet;
  }

  type basicEntityFinder = 'ID' | 'CODE';

  type ValueOf<T> = T[keyof T];

  type RawQuestion = {
    category: string;
    sub_category: string;
    question: string;
    category_id: string;
    sub_category_id: string;
    question_id: string;
    description: string;
    emoji: string;
  };
}
