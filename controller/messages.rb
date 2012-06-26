module Controller
  class Messages < Base
    map '/messages'

    before_all do
      require_login
    end

    layout do |path|
      if path =~ %r{^_}
        nil
      elsif session[:layout] == 'narrow'
        :narrow
      else
        :default
      end
    end

    def index
      @messages = account.messages
      @contacts = Libertree::Model::Member.all.sort_by(&:name_display)
    end

    def create
      redirect_referrer  if ! request.post?
      redirect_referrer  if request['text'].empty?

      message = Libertree::Model::Message.create_with_recipients(
        sender_member_id: account.member.id,
        text: request['text'],
        recipient_member_ids: request['recipients']
      )

      # Libertree::Model::Job.create(
        # {
          # task: 'request:MESSAGE',
          # params: {
            # 'message_id' => message.id,
            # 'server_id'  => xx,
          # }.to_json,
        # }
      # )

      session[:saved_text]["textarea-message-new"] = nil

      redirect_referrer
    end
  end
end