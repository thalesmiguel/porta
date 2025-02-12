# frozen_string_literal: true

require 'test_helper'

class DeveloperPortal::Admin::Account::PersonalDetailsControllerTest < DeveloperPortal::ActionController::TestCase
  def setup
    super
    @provider = FactoryBot.create(:provider_account)
    host! @provider.external_domain
    @buyer = FactoryBot.create(:buyer_account, provider_account: @provider)
  end

  test 'no access granted for provider admin' do
    # now exists other routes in provider side
    host! @provider.external_admin_domain

    login_as @provider.admins.first
    get :show

    assert_response 404
  end

  test 'no access granted for provider members' do
    # now exists other routes in provider side
    host! @provider.external_admin_domain

    provider_member = FactoryBot.create(:active_user, account: @provider)
    assert provider_member.member?

    login_as provider_member
    get :show

    assert_response 404
  end

  test 'grant access to admin' do
    login_as @buyer.admins.first
    get :show

    assert_response :success
  end

  test 'grant access to member' do
    buyer_member = FactoryBot.create(:active_user, account: @buyer)
    assert buyer_member.member?

    login_as buyer_member
    get :show

    assert_response :success
  end
end
