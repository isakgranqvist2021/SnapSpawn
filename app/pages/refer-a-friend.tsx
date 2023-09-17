import { DefaultHead } from '@aa/components/default-head';
import { Footer } from '@aa/components/footer';
import { Nav } from '@aa/components/nav';
import {
  MainContainer,
  MainContainerContent,
  MainContainerLayout,
} from '@aa/containers/main-container';
import { verifyAndCompletePayment } from '@aa/services/payment';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetServerSidePropsContext } from 'next';
import { Fragment } from 'react';

export default function ReferAFriend() {
  return (
    <Fragment>
      <DefaultHead title="Refer a friend" />

      <MainContainer>
        <Nav />

        <MainContainerLayout>
          <MainContainerContent>
            <div className="flex flex-col gap-3 py-10 px-5">
              <div>
                <h1 className="text-xl">Refer a friend</h1>
                <p className="max-w-prose">
                  Invite your friends to Ai Portrait Studio and earn credits
                  when they sign up and purchase credits.
                </p>
              </div>

              <form className="flex flex-wrap gap-3">
                <div className="form-control w-full max-w-xs">
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    className="input input-bordered w-full max-w-xs"
                  />
                </div>

                <button className="btn btn-primary">Send invitation</button>
              </form>

              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Email</th>
                      <th>Created At</th>
                      <th>Earned Credits</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td>randomemail@gmail.com</td>
                      <td>2023-09-17</td>
                      <td>10</td>
                      <td>
                        <span className="badge badge-success">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <th>2</th>
                      <td>randomemail@gmail.com</td>
                      <td>2023-09-17</td>
                      <td>0</td>
                      <td>
                        <span className="badge badge-warning">Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </MainContainerContent>
        </MainContainerLayout>
      </MainContainer>

      <Footer />
    </Fragment>
  );
}

async function loadServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx.req, ctx.res);

  return { props: {} };
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/account',
  getServerSideProps: loadServerSideProps,
});
