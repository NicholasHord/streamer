var assert = require('assert');
var XAPPAccessor = require('../xappAdapter').XAPPAccessor;
var XAPPAdapter = require('../xappAdapter').XAPPAdapter;

describe('XAPPAdapter', function() {
    describe('#request', function() {
        it("Loads and adapts XAPP", function(done) {
            var adapter = new XAPPAdapter('preview.xappmedia.com',
                'XappMediaApiKey',
                'DefaultApp');
            adapter.request('Streaming/JPKStreamingTest', null, function(audioData) {
                assert.equal(audioData.introduction, "<speak>Speak now or forever</speak>");
                assert.equal(audioData.tracks.length, 3);
                assert.equal(audioData.tracks[0].title, 'Podcast1');
                assert.equal(audioData.tracks[1].title, 'Podcast1');
                assert.equal(audioData.tracks[2].title, 'Podcast2');
                done();
            });
        });

        it("Loads and adapts XAPP - filtered by intent", function(done) {
            var adapter = new XAPPAdapter('preview.xappmedia.com',
                'XappMediaApiKey',
                'DefaultApp');
            adapter.request('Streaming/JPKStreamingTest', 'Academics', function(audioData) {
                assert.equal(audioData.introduction, "<speak>Speak now or forever</speak>");
                assert.equal(audioData.tracks.length, 2);
                assert.equal(audioData.tracks[0].title, 'Podcast1');
                assert.equal(audioData.tracks[1].title, 'Podcast2');
                done();
            });
        });

        it("Loads and adapts XAPP - filtering ignores builtin", function(done) {
            var adapter = new XAPPAdapter('preview.xappmedia.com',
                'XappMediaApiKey',
                'DefaultApp');
            adapter.request('Streaming/JPKStreamingTest', 'AMAZON.PlayIntent', function(audioData) {
                assert.equal(audioData.introduction, '<speak>Speak now or forever</speak>');
                assert.equal(audioData.tracks.length, 3);
                done();
            });
        });

        it("Loads and adapts XAPP - with tts action", function(done) {
            var adapter = new XAPPAdapter('preview.xappmedia.com',
                'XappMediaApiKey',
                'DefaultApp');
            adapter.request('JPKUnitTest/JPKUnitTest-CustomActionTTS', 'abOutus', function(audioData) {
                assert.equal(audioData.ssml, '<speak>This is TTS</speak>');
                done();
            });
        });

        it("Loads and adapts XAPP - with trailing audio action", function(done) {
            this.timeout(5000);
            var adapter = new XAPPAdapter('preview.xappmedia.com',
                'XappMediaApiKey',
                'DefaultApp');
            adapter.request('JPKUnitTest/JPKUnitTest-CustomActionTTS', 'academics', function(audioData) {
                assert.equal(audioData.ssml, '<speak><audio url="https://s3.amazonaws.com/xapp-alexa/JPKUnitTest-JPKUnitTest-CustomActionTTS-2760-TRAILING.mp3" /></speak>');
            }, function () {
                console.log("Converted");
                done();
            });
        });
    });
});

describe('XAPPAccessor', function() {
    describe('#request', function() {
        it("Loads XAPP", function(done) {
            var accessor = new XAPPAccessor('preview.xappmedia.com',
                'XappMediaApiKey',
                'DefaultApp');
            accessor.request('Streaming/JPKStreamingTest', function (response, error) {
                assert.equal(response.xappName, "JPKStreamingTest");
                done();
            });
        });
    });
});