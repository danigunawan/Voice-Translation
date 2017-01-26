class CommandsController < ApplicationController
  def create
    new_command = Command.new(command_params)
    new_command.save
    redirect_to root_path
  end

  def destroy
    command = Command.find(params[:id])
    command.destroy
    redirect_to root_path
  end

  private

  def command_params
    params.require(:command).permit(:keywords, :response, :language)
  end
end
