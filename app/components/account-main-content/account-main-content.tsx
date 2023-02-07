import {
  MainContainerContent,
  MainContainerLayout,
} from '@aa/containers/main-container';

import { AddCreditsSidebar } from './add-credits-sidebar';
import { GenerateAvatarSidebar } from './generate-avatars-sidebar';
import { MyAvatars } from './my-avatars';

export function AccountMainContent() {
  return (
    <MainContainerLayout>
      <GenerateAvatarSidebar />

      <MainContainerContent>
        <MyAvatars />
      </MainContainerContent>

      <AddCreditsSidebar />
    </MainContainerLayout>
  );
}
