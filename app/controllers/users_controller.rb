class UsersController < ApplicationController
  def new
    @user = User.new
    render component: 'SignupForm', props: { user: @user }
  end

  def create
    @user = User.new(user_params)

    puts 'WHAT'
    puts @user.projects.count
    if @user.save
      redirect_to @user.default_project, notice: 'User was successfully created.'
    else
      puts @user.errors.full_messages
    end
  end

  def update
    if @user.update(user_params)
      redirect_to @user, notice: 'User was successfully updated.'
    else
      render :edit
    end
  end

  private

  # Only allow a list of trusted parameters through.
  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
